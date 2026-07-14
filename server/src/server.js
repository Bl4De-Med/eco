import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { pool } from './db.js';
import { z } from 'zod';
import 'dotenv/config';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.get('/api/products', async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, q, specKey, specValue, featured } = req.query;
    const where = ['p.is_active = 1']; const params = [];
    if (category) { where.push('c.slug = ?'); params.push(category); }
    if (minPrice) { where.push('COALESCE(p.discount_price, p.price) >= ?'); params.push(Number(minPrice)); }
    if (maxPrice) { where.push('COALESCE(p.discount_price, p.price) <= ?'); params.push(Number(maxPrice)); }
    if (featured === 'true') where.push('p.is_featured = 1');
    if (q) { where.push('MATCH(p.name, p.brand, p.short_description, p.description) AGAINST (? IN BOOLEAN MODE)'); params.push(`${q}*`); }
    if (specKey && specValue) { where.push('EXISTS (SELECT 1 FROM product_specifications ps WHERE ps.product_id=p.id AND ps.spec_key=? AND ps.spec_value LIKE ?)'); params.push(specKey, `%${specValue}%`); }
    const [rows] = await pool.execute(`SELECT p.id,p.sku,p.name,p.slug,p.short_description,p.brand,p.price,p.discount_price,p.stock,p.average_rating,p.review_count,c.name category,c.slug category_slug,(SELECT image_url FROM product_images WHERE product_id=p.id ORDER BY is_primary DESC,sort_order ASC LIMIT 1) image_url FROM products p JOIN categories c ON c.id=p.category_id WHERE ${where.join(' AND ')} ORDER BY p.is_featured DESC,p.created_at DESC`, params);
    res.json({ data: rows });
  } catch (error) { next(error); }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const [products] = await pool.execute('SELECT p.*,c.name category,c.slug category_slug FROM products p JOIN categories c ON c.id=p.category_id WHERE (p.id=? OR p.slug=?) AND p.is_active=1 LIMIT 1', [req.params.id, req.params.id]);
    if (!products[0]) return res.status(404).json({ error: 'Product not found' });
    const product = products[0];
    const [[images], [specifications], [options], [reviews]] = await Promise.all([
      pool.execute('SELECT id,image_url,alt_text,sort_order,is_primary FROM product_images WHERE product_id=? ORDER BY is_primary DESC,sort_order', [product.id]),
      pool.execute('SELECT spec_key,spec_value,display_order FROM product_specifications WHERE product_id=? ORDER BY display_order', [product.id]),
      pool.execute('SELECT id,option_group,option_name,price_adjustment,is_default FROM product_customization_options WHERE product_id=? AND is_active=1 ORDER BY option_group,display_order', [product.id]),
      pool.execute('SELECT r.id,r.rating,r.title,r.body,r.created_at,u.first_name,u.last_name FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.product_id=? AND r.is_approved=1 ORDER BY r.created_at DESC', [product.id])
    ]);
    res.json({ data: { ...product, images, specifications, customization_options: options, reviews } });
  } catch (error) { next(error); }
});

const orderSchema = z.object({
  userId: z.coerce.number().int().positive(), items: z.array(z.object({ productId: z.coerce.number().int().positive(), quantity: z.coerce.number().int().min(1).max(20), customizations: z.record(z.string()).optional() })).min(1).max(30),
  shipping: z.object({ name:z.string().min(2).max(160), email:z.string().email(), line1:z.string().min(3).max(255), line2:z.string().max(255).optional(), city:z.string().min(2).max(120), postalCode:z.string().min(2).max(30), country:z.string().length(2) })
});
app.post('/api/orders', async (req, res, next) => {
  let connection;
  try {
    const payload = orderSchema.parse(req.body); connection = await pool.getConnection(); await connection.beginTransaction();
    const ids = payload.items.map(i => i.productId); const marks = ids.map(() => '?').join(',');
    const [products] = await connection.execute(`SELECT id,name,sku,price,discount_price,stock FROM products WHERE id IN (${marks}) AND is_active=1 FOR UPDATE`, ids);
    if (products.length !== ids.length) throw Object.assign(new Error('One or more products are unavailable'), { status: 400 });
    let subtotal = 0; const lines = [];
    for (const item of payload.items) { const product = products.find(p => p.id === item.productId); if (product.stock < item.quantity) throw Object.assign(new Error(`${product.name} no longer has enough stock`), { status: 409 }); const unitPrice=Number(product.discount_price ?? product.price); const lineTotal=unitPrice*item.quantity; subtotal += lineTotal; lines.push({ ...item, product, unitPrice, lineTotal }); }
    const shippingAmount = subtotal >= 500 ? 0 : 24.99; const taxAmount = Number((subtotal * 0.2).toFixed(2)); const total = Number((subtotal + shippingAmount + taxAmount).toFixed(2)); const orderNumber=`ECO-${Date.now()}-${Math.floor(Math.random()*900+100)}`;
    const s=payload.shipping; const [result] = await connection.execute('INSERT INTO orders (user_id,order_number,subtotal,shipping_amount,tax_amount,total_amount,shipping_name,shipping_email,shipping_address_line1,shipping_address_line2,shipping_city,shipping_postal_code,shipping_country) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',[payload.userId,orderNumber,subtotal,shippingAmount,taxAmount,total,s.name,s.email,s.line1,s.line2||null,s.city,s.postalCode,s.country.toUpperCase()]);
    for (const line of lines) { await connection.execute('INSERT INTO order_items (order_id,product_id,product_name,product_sku,unit_price,quantity,customization_json,line_total) VALUES (?,?,?,?,?,?,?,?)',[result.insertId,line.product.id,line.product.name,line.product.sku,line.unitPrice,line.quantity,JSON.stringify(line.customizations||{}),line.lineTotal]); await connection.execute('UPDATE products SET stock=stock-? WHERE id=?',[line.quantity,line.product.id]); }
    await connection.commit(); res.status(201).json({ data:{ id:result.insertId, orderNumber, total } });
  } catch (error) { if (connection) await connection.rollback(); next(error); } finally { connection?.release(); }
});
app.use((err, _, res, __) => { console.error(err); res.status(err.status || (err instanceof z.ZodError ? 400 : 500)).json({ error: err instanceof z.ZodError ? 'Invalid order data' : err.message || 'Internal server error' }); });
app.listen(Number(process.env.PORT || 4000), () => console.log('API listening on port 4000'));

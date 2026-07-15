import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import forge850GoldImg from './forge-850-gold.jpg';
import aegisApexPcImg from './aegis-apex-pc.png';
import titanGpuImg from './titan-gpu.png';
import aegisVectorPcImg from './aegis-vector-pc.png';
import glacierCoolerImg from './glacier-cooler.png';
import vertexMousepadImg from './vertex-mousepad.png';
import vectorSsdImg from './vector-ssd.png';

const API=import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const products=[
 {id:1,slug:'aegis-apex-v1',name:'Aegis Apex v1',category:'Pre-built PCs',price:3199.99,discount_price:2999.99,stock:12,average_rating:4.8,image_url:aegisApexPcImg},
 {id:2,slug:'vortex-rapidfire',name:'Vortex RapidFire',category:'Peripherals',price:229.99,discount_price:199.99,stock:40,average_rating:4.5,image_url:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85'},
 {id:3,slug:'horizon-360hz',name:'Horizon 360Hz',category:'Monitors',price:699.99,discount_price:649.99,stock:25,average_rating:5,image_url:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=85'},
 {id:4,slug:'nova-strike-rgb',name:'Nova Strike RGB',category:'Peripherals',price:89.99,discount_price:74.99,stock:65,average_rating:4.7,image_url:'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=85'},
 {id:5,slug:'titan-4070-ti',name:'Titan RTX 4070 Ti',category:'Components',price:849.99,discount_price:799.99,stock:18,average_rating:4.6,image_url:titanGpuImg},
 {id:6,slug:'spectra-240hz',name:'Spectra 240Hz',category:'Monitors',price:429.99,discount_price:389.99,stock:32,average_rating:4.8,image_url:'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1200&q=85'},
 {id:7,slug:'phantom-pro-wireless',name:'Phantom Pro Wireless',category:'Peripherals',price:149.99,discount_price:null,stock:51,average_rating:4.7,image_url:'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=85'},
 {id:8,slug:'rift-xr-elite',name:'Rift XR Elite',category:'VR Headsets',price:549.99,discount_price:499.99,stock:21,average_rating:4.6,image_url:'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=1200&q=85'},
 {id:9,slug:'aegis-vector-s',name:'Aegis Vector S',category:'Pre-built PCs',price:1899.99,discount_price:1749.99,stock:9,average_rating:4.9,image_url:aegisVectorPcImg},
 {id:10,slug:'pulsefire-65',name:'PulseFire 65',category:'Peripherals',price:139.99,discount_price:119.99,stock:47,average_rating:4.5,image_url:'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=85'},
 {id:11,slug:'core-ddr5-32',name:'Core DDR5 32GB',category:'Components',price:129.99,discount_price:null,stock:70,average_rating:4.8,image_url:'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=85'},
 {id:12,slug:'nebula-4k',name:'Nebula 4K OLED',category:'Monitors',price:999.99,discount_price:899.99,stock:14,average_rating:4.9,image_url:'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1200&q=85'},
 {id:13,slug:'sonic-orbit',name:'Sonic Orbit Wireless',category:'Audio',price:179.99,discount_price:149.99,stock:36,average_rating:4.7,image_url:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85'},
 {id:14,slug:'forge-850-gold',name:'Forge 850 Gold',category:'Components',price:159.99,discount_price:139.99,stock:28,average_rating:4.6,image_url:forge850GoldImg},
 {id:15,slug:'altitude-airflow',name:'Altitude Airflow',category:'Accessories',price:119.99,discount_price:null,stock:33,average_rating:4.5,image_url:'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=1200&q=85'},
 {id:16,slug:'glacier-mk2',name:'Glacier MK2',category:'Cooling',price:109.99,discount_price:94.99,stock:46,average_rating:4.6,image_url:glacierCoolerImg},
 {id:17,slug:'vertex-control-xl',name:'Vertex Control XL',category:'Accessories',price:44.99,discount_price:null,stock:83,average_rating:4.7,image_url:vertexMousepadImg},
 {id:18,slug:'vector-2tb-gen5',name:'Vector 2TB Gen5',category:'Components',price:219.99,discount_price:189.99,stock:39,average_rating:4.8,image_url:vectorSsdImg},
 {id:19,slug:'summit-duo-arm',name:'Summit Duo Arm',category:'Accessories',price:129.99,discount_price:109.99,stock:22,average_rating:4.5,image_url:'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=85'},
 {id:20,slug:'arc-lightbar',name:'Arc Lightbar',category:'Accessories',price:69.99,discount_price:59.99,stock:58,average_rating:4.6,image_url:'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=1200&q=85'}
];
const peripheralCollections={
 keyboards:{title:'Gaming Keyboards',subtitle:'Precision switches, responsive inputs, and premium builds for every playstyle.',match:p=>/Vortex|PulseFire/.test(p.name)},
 mice:{title:'Gaming Mice',subtitle:'Ultra-light wireless performance and pinpoint control for competitive play.',match:p=>/Nova|Phantom/.test(p.name)},
 headsets:{title:'Gaming Headsets',subtitle:'Immersive positional audio for the worlds and teammates that matter.',match:p=>/Sonic/.test(p.name)},
 accessories:{title:'Gaming Accessories',subtitle:'The finishing pieces for a setup that feels entirely yours.',match:p=>p.category==='Accessories'}
};

const productOptions = {
  1: {
    RAM: ['32GB DDR5-6000 CL30', '64GB DDR5-6000 CL30 (+150 Dhs)'],
    Storage: ['2TB NVMe Gen4 SSD', '4TB NVMe Gen4 SSD (+100 Dhs)']
  },
  2: {
    'Switch Feel': ['Magnetic', 'Linear', 'Tactile']
  },
  4: {
    Color: ['Carbon Black', 'Chalk White']
  },
  5: {
    Edition: ['Standard Edition', 'Overclocked Edition (+50 Dhs)']
  },
  7: {
    'Grip Style': ['Matte Textured', 'Grip Tape Bundle (+10 Dhs)']
  },
  8: {
    Storage: ['128GB', '256GB (+100 Dhs)']
  },
  9: {
    RAM: ['16GB DDR5', '32GB DDR5 (+80 Dhs)'],
    Storage: ['1TB NVMe SSD', '2TB NVMe SSD (+60 Dhs)']
  },
  10: {
    'Switch Type': ['Linear Red', 'Tactile Brown', 'Clicky Blue']
  },
  11: {
    Speed: ['6000 MT/s CL30', '6400 MT/s CL32 (+30 Dhs)']
  },
  13: {
    'Ear Cushions': ['Cooling Gel-infused', 'Premium Protein Leather']
  },
  14: {
    Color: ['White (Original)', 'Black Matte']
  },
  16: {
    'Radiator Size': ['360mm Triple Fan', '240mm Dual Fan (-20 Dhs)']
  },
  17: {
    Design: ['Classic Stealth Black', 'Neon Cyberpunk (+5 Dhs)']
  },
  18: {
    'Cooling Option': ['With Active Heatsink', 'Without Heatsink (-20 Dhs)']
  }
};

const productSpecs = {
  1: (selected) => [
    ['Processor', 'AMD Ryzen 7 7800X3D'],
    ['Graphics', 'NVIDIA RTX 4080 SUPER 16GB'],
    ['Memory', selected.RAM || '32GB DDR5-6000 CL30'],
    ['Storage', selected.Storage || '2TB NVMe Gen4 SSD'],
    ['Cooling', '360mm ARGB AIO + 6 PWM fans'],
    ['Case', 'Dual-chamber panoramic glass']
  ],
  2: (selected) => [
    ['Switches', 'Hall Effect magnetic'],
    ['Actuation', '0.1mm–4.0mm adjustable'],
    ['Polling', '8000Hz wired'],
    ['Frame', 'CNC aluminum'],
    ['Keycaps', 'PBT double-shot'],
    ['Switch Feel', selected['Switch Feel'] || 'Magnetic']
  ],
  3: () => [
    ['Panel', '27-inch Fast-IPS'],
    ['Resolution', '2560 × 1440 QHD'],
    ['Refresh rate', '360Hz'],
    ['Response time', '0.5ms GtG'],
    ['HDR', 'VESA DisplayHDR 600'],
    ['Sync', 'G-SYNC Compatible']
  ],
  4: (selected) => [
    ['Sensor', 'Hero 25K Optical'],
    ['Connectivity', 'USB-C Wired / 2.4GHz Wireless'],
    ['Weight', '63g Ultra-lightweight'],
    ['DPI', '100 - 25,600 DPI'],
    ['RGB Lighting', '3-Zone Aura Sync RGB'],
    ['Color', selected.Color || 'Carbon Black']
  ],
  5: (selected) => [
    ['GPU Engine', 'NVIDIA GeForce RTX 4070 Ti'],
    ['VRAM', '12GB GDDR6X 192-bit'],
    ['Clock Speed', '2.61 GHz Boost'],
    ['CUDA Cores', '7680'],
    ['Interface', 'PCIe 4.0 x16'],
    ['Edition', selected.Edition || 'Standard Edition']
  ],
  6: () => [
    ['Panel', '24.5-inch Fast-IPS'],
    ['Resolution', '1920 × 1080 FHD'],
    ['Refresh rate', '240Hz'],
    ['Response time', '1ms GtG'],
    ['HDR', 'HDR10 Support'],
    ['Sync', 'FreeSync Premium & G-SYNC Compatible']
  ],
  7: (selected) => [
    ['Sensor', 'Focus Pro 30K Optical'],
    ['Polling Rate', 'True 4000Hz Wireless'],
    ['Weight', '58g Esports design'],
    ['Battery Life', 'Up to 90 hours'],
    ['Connectivity', 'HyperSpeed Wireless / Wired'],
    ['Grip Style', selected['Grip Style'] || 'Matte Textured']
  ],
  8: (selected) => [
    ['Resolution', '3840 × 1920 combined (1920 × 1920 per eye)'],
    ['Refresh rate', '90Hz / 120Hz'],
    ['Field of View', 'Up to 110 degrees'],
    ['Processor', 'Snapdragon XR2 Gen 1'],
    ['Tracking', '6 DoF inside-out tracking'],
    ['Storage', selected.Storage || '128GB']
  ],
  9: (selected) => [
    ['Processor', 'AMD Ryzen 5 7600X'],
    ['Graphics', 'NVIDIA RTX 4060 Ti 8GB'],
    ['Memory', selected.RAM || '16GB DDR5'],
    ['Storage', selected.Storage || '1TB NVMe SSD'],
    ['Cooling', '240mm Liquid AIO Cooler'],
    ['Power Supply', '650W 80+ Bronze']
  ],
  10: (selected) => [
    ['Layout', '65% Compact Form Factor'],
    ['Switches', selected['Switch Type'] || 'Linear Red'],
    ['Connectivity', '2.4GHz Wireless / Bluetooth / USB-C'],
    ['Keycaps', 'PBT Double-shot'],
    ['Hot-swappable', 'Yes, 3/5-pin support'],
    ['Battery Life', 'Up to 150 hours (RGB off)']
  ],
  11: (selected) => [
    ['Capacity', '32GB (2 x 16GB)'],
    ['Type', 'DDR5 SDRAM'],
    ['Speed', selected.Speed || '6000 MT/s CL30'],
    ['CAS Latency', 'CL30-38-38-96'],
    ['Voltage', '1.35V'],
    ['Heat Spreader', 'Anodized Aluminum with RGB Lightbar']
  ],
  12: () => [
    ['Panel', '31.5-inch QD-OLED'],
    ['Resolution', '3840 × 2160 UHD 4K'],
    ['Refresh rate', '240Hz'],
    ['Response time', '0.03ms GtG'],
    ['Contrast Ratio', '1,500,000:1 (Infinite)'],
    ['Sync', 'FreeSync Premium Pro / G-SYNC Compatible']
  ],
  13: (selected) => [
    ['Driver Size', '50mm Neodymium Drivers'],
    ['Frequency Response', '20Hz - 40kHz (Hi-Res)'],
    ['Connection', '2.4GHz Lossless Wireless / Bluetooth / 3.5mm'],
    ['Microphone', 'Detachable Broadcast-grade Cardioid'],
    ['Battery Life', 'Up to 40 hours with Fast Charge'],
    ['Ear Cushions', selected['Ear Cushions'] || 'Cooling Gel-infused']
  ],
  14: (selected) => [
    ['Wattage', '850 Watts'],
    ['Efficiency Rating', '80 PLUS Gold Certified (Up to 92%)'],
    ['Modular', 'Full Modular Cable Management'],
    ['Fan', '135mm Fluid Dynamic Bearing (FDB) Silent Fan'],
    ['Form Factor', 'ATX 3.0 & PCIe 5.0 Ready (12VHPWR Included)'],
    ['Color', selected.Color || 'White (Original)'],
    ['Warranty', '10 Years']
  ],
  15: () => [
    ['Type', 'Laptop Cooling Stand / Vertical Stand'],
    ['Fans', '3x 120mm Silent Fans (Adjustable Speed)'],
    ['Height Adjustment', '5 Ergonomic Angles'],
    ['Material', 'Aircraft-grade Aluminum & Mesh'],
    ['Hub', '2x USB 2.0 Passthrough Ports'],
    ['Compatibility', 'Up to 17.3" Gaming Laptops']
  ],
  16: (selected) => [
    ['Type', '360mm All-in-One Liquid CPU Cooler'],
    ['Pump Speed', 'PWM controlled (800 - 2800 RPM)'],
    ['Radiator Size', selected['Radiator Size'] || '360mm Triple Fan'],
    ['Fans', '3x 120mm High-Static Pressure ARGB Fans'],
    ['Socket Support', 'Intel LGA 1700/1200/115X, AMD AM5/AM4'],
    ['Display', 'Custom 2.4" LCD Screen for system stats/GIFs']
  ],
  17: (selected) => [
    ['Size', 'Extra Large (900 × 400 mm)'],
    ['Thickness', '4mm Premium Density'],
    ['Surface', 'Micro-woven Glide Control Fabric'],
    ['Base', 'Anti-slip Natural Rubber'],
    ['Edges', 'Double-stitched Anti-fray Edges'],
    ['Design', selected.Design || 'Classic Stealth Black']
  ],
  18: (selected) => [
    ['Capacity', '2TB NVMe PCIe Gen5 x4'],
    ['Read Speed', 'Up to 12,400 MB/s'],
    ['Write Speed', 'Up to 11,800 MB/s'],
    ['Form Factor', 'M.2 2280'],
    ['Cooling Option', selected['Cooling Option'] || 'With Active Heatsink'],
    ['TBW', '1400 TBW']
  ],
  19: () => [
    ['Monitor Capacity', 'Dual monitors up to 32" each'],
    ['Weight Capacity', '2.2 - 20 lbs per arm'],
    ['Tilt Range', '+90° to -90°'],
    ['Rotation', '360° portrait/landscape'],
    ['Mount Type', 'Heavy-duty C-Clamp or Grommet Base'],
    ['Material', 'Die-cast Aluminum alloy']
  ],
  20: () => [
    ['Light Source', 'Dual-color LED (Warm/Cool Mixed)'],
    ['Color Temperature', '2700K - 6500K Adjustable'],
    ['Mount', 'Smart-gravity Clip (fits flat/curved screens)'],
    ['Control', 'Wireless Desktop Controller Dial'],
    ['Power', 'USB Type-C (5V/1A)'],
    ['Auto-Dimming', 'Built-in ambient light sensor']
  ]
};

const CartContext=createContext(); const useCart=()=>useContext(CartContext); const money=n=>new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n) + ' Dhs';
function Layout({children}){const {items}=useCart(); return <><header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur"><nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><Link className="text-xl font-black tracking-[.2em] text-slate-900" to="/">ECO<span className="text-neon">//</span></Link><div className="hidden gap-6 text-sm font-semibold text-slate-700 md:flex"><a href="/#trending">Trending</a><a href="/#categories">Categories</a></div><Link to="/cart" className="rounded-full border border-neon/40 px-4 py-2 text-sm font-semibold text-neon">Cart ({items.reduce((n,i)=>n+i.quantity,0)})</Link></nav></header>{children}</>}
function Stars({rating}){return <span className="text-amber-300">{'★'.repeat(Math.round(rating))}<span className="text-slate-700">{'★'.repeat(5-Math.round(rating))}</span></span>}
function Card({product}){return <Link to={`/products/${product.slug}`} className="group card overflow-hidden"><img className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" src={product.image_url} alt={product.name}/><div className="p-5"><p className="text-xs font-bold uppercase tracking-widest text-neon">{product.category}</p><h3 className="mt-2 text-lg font-bold">{product.name}</h3><div className="mt-3 flex items-center justify-between"><span><b>{money(product.discount_price||product.price)}</b>{product.discount_price&&<del className="ml-2 text-sm text-slate-500">{money(product.price)}</del>}</span><Stars rating={product.average_rating}/></div></div></Link>}
function Home(){return <main><section className="relative isolate overflow-hidden border-b border-white/10"><div className="hero-grid absolute inset-0 -z-10 opacity-50"/><div className="mx-auto grid max-w-7xl gap-8 px-6 py-24 md:grid-cols-2 md:py-32"><div><p className="mb-5 font-bold tracking-[.24em] text-neon">SUMMER SETUP SEASON</p><h1 className="max-w-xl text-5xl font-black leading-none md:text-7xl">PLAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-pulse">WITHOUT</span> LIMITS.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">Premium gaming electronics curated for maximum frames, instant response, and immersive worlds.</p><a href="#trending" className="mt-8 inline-block rounded-lg bg-neon px-6 py-3 font-bold text-slate-950 shadow-neon">Shop trending gear →</a></div><div className="relative"><img className="h-80 w-full rounded-2xl object-cover shadow-neon md:h-full" src={products[0].image_url} alt="Aegis gaming PC"/><div className="absolute -bottom-4 -left-4 rounded-xl border border-white/15 bg-panel p-4"><p className="text-xs text-slate-300">FEATURED BUILD</p><p className="font-bold">Aegis Apex v1</p></div></div></div></section><section id="categories" className="mx-auto max-w-7xl px-6 py-20"><p className="eyebrow">Build your setup</p><h2 className="section-title">Shop peripherals</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(peripheralCollections).map(([slug,collection],i)=><Link to={`/peripherals/${slug}`} key={slug} className="card p-6 transition hover:-translate-y-1"><span className="text-4xl">{['⌨','◉','◌','✦'][i]}</span><h3 className="mt-7 text-lg font-bold">{collection.title}</h3><p className="mt-2 text-sm text-slate-300">Explore collection →</p></Link>)}</div></section><section id="trending" className="mx-auto max-w-7xl px-6 pb-24"><p className="eyebrow">Fresh drops & deals</p><h2 className="section-title">Explore the full collection</h2><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map(p=><Card product={p} key={p.id}/>)}</div></section></main>}
function PeripheralCollection(){const {type}=useParams();const collection=peripheralCollections[type]||peripheralCollections.keyboards;const list=products.filter(collection.match);return <main className="mx-auto max-w-7xl px-6 py-14"><Link className="text-sm font-semibold text-neon" to="/">← All collections</Link><p className="eyebrow mt-8">Summer essentials</p><h1 className="mt-2 text-4xl font-black md:text-5xl">{collection.title}</h1><p className="mt-4 max-w-2xl text-lg text-slate-300">{collection.subtitle}</p><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map(p=><Card product={p} key={p.id}/>)}</div></main>}
function ProductDetail(){
  const nav=useNavigate();
  const {add}=useCart();
  const slug=location.pathname.split('/').pop();
  const product=products.find(p=>p.slug===slug)||products[0];
  const options=productOptions[product.id]||{};
  const [selected,setSelected]=useState({});

  useEffect(()=>{
    const initial={};
    Object.entries(options).forEach(([group,vals])=>{
      initial[group]=vals[0].split(' (+')[0].split(' (-')[0];
    });
    setSelected(initial);
  },[product.id]);

  const specsFunc=productSpecs[product.id]||productSpecs[3];
  const specs=specsFunc(selected);return <main className="mx-auto max-w-7xl px-6 py-12"><button onClick={()=>nav(-1)} className="text-sm text-slate-400 hover:text-white">← Back to shop</button><div className="mt-7 grid gap-12 lg:grid-cols-2"><div><img className="h-[460px] w-full rounded-2xl object-cover" src={product.image_url} alt={product.name}/><div className="mt-4 flex gap-3"><button className="h-20 w-24 overflow-hidden rounded border-2 border-neon"><img className="h-full w-full object-cover" src={product.image_url} alt="Product thumbnail"/></button></div></div><div><p className="eyebrow">{product.category}</p><h1 className="mt-2 text-4xl font-black">{product.name}</h1><div className="mt-3 flex gap-3"><Stars rating={product.average_rating}/><span className="text-slate-400">{product.average_rating} verified rating</span></div><div className="mt-7 flex items-center gap-3"><span className="text-3xl font-black text-neon">{money(product.discount_price||product.price)}</span>{product.discount_price&&<><del className="text-slate-500">{money(product.price)}</del><span className="rounded bg-pulse/20 px-2 py-1 text-xs font-bold text-purple-300">SAVE {money(product.price-product.discount_price)}</span></>}</div><p className="mt-3 text-sm font-semibold text-emerald-400">● In stock — ships within 24 hours</p>{Object.entries(options).map(([group,vals])=><div className="mt-7" key={group}><label className="mb-2 block text-sm font-bold">{group}</label><div className="flex flex-wrap gap-2">{vals.map(v=><button key={v} onClick={()=>setSelected({...selected,[group]:v.split(' (+')[0]})} className={`rounded-lg border px-3 py-2 text-sm ${selected[group]===v.split(' (+')[0]?'border-neon bg-neon/10 text-neon':'border-white/15 text-slate-300'}`}>{v}</button>)}</div></div>)}<button onClick={()=>{add(product,selected);nav('/cart')}} className="mt-8 w-full rounded-lg bg-neon py-4 font-black text-ink">Add to cart — {money(product.discount_price||product.price)}</button></div></div><section className="mt-16 grid gap-10 lg:grid-cols-3"><div className="lg:col-span-2"><h2 className="section-title">Technical specifications</h2><div className="mt-5 overflow-hidden rounded-xl border border-white/10">{specs.map(([k,v])=><div className="grid grid-cols-3 border-b border-white/10 p-4 last:border-0" key={k}><b className="text-slate-400">{k}</b><span className="col-span-2">{v}</span></div>)}</div></div><div><h2 className="section-title">Community reviews</h2><div className="mt-5 card p-5"><Stars rating={product.average_rating}/><b className="ml-3 text-2xl">{product.average_rating}/5</b><p className="mt-4 text-sm text-slate-400">★★★★★  Excellent performance and premium build quality.</p><p className="mt-4 text-sm text-slate-400">★★★★☆  Fast delivery, exactly as described.</p></div></div></section></main>}
function Cart(){const {items,setItems}=useCart();const [open,setOpen]=useState(false),[confirmed,setConfirmed]=useState(false);const subtotal=items.reduce((n,i)=>n+(i.product.discount_price||i.product.price)*i.quantity,0),shipping=subtotal>=500||!subtotal?0:24.99,tax=subtotal*.2,total=subtotal+shipping+tax;const field='mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neon focus:ring-2 focus:ring-neon/15';return <main className="mx-auto max-w-6xl px-6 py-12"><h1 className="text-4xl font-black">Your loadout</h1>{confirmed?<div className="card mt-8 max-w-2xl p-10 text-center"><span className="text-5xl">✓</span><h2 className="mt-4 text-3xl font-black">Thanks for shopping with ECO.</h2><p className="mt-3 text-slate-600">Your order has been confirmed. We’ll send your delivery details by email shortly.</p><Link className="mt-7 inline-block rounded-lg bg-neon px-5 py-3 font-bold text-white" to="/">Continue shopping</Link></div>:<div className="mt-8 grid gap-8 lg:grid-cols-3"><section className="space-y-4 lg:col-span-2">{!items.length?<div className="card p-8 text-slate-500">Your cart is empty. <Link className="text-neon" to="/">Browse gear</Link></div>:items.map((item,index)=><div className="card flex gap-4 p-4" key={index}><img className="h-24 w-28 rounded object-cover" src={item.product.image_url} alt=""/><div className="flex-1"><h2 className="font-bold">{item.product.name}</h2><p className="text-sm text-slate-500">{Object.values(item.customizations).join(' · ')}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center gap-3"><button onClick={()=>setItems(items.map((x,i)=>i===index?{...x,quantity:Math.max(1,x.quantity-1)}:x))}>−</button><b>{item.quantity}</b><button onClick={()=>setItems(items.map((x,i)=>i===index?{...x,quantity:x.quantity+1}:x))}>+</button></div><b>{money((item.product.discount_price||item.product.price)*item.quantity)}</b></div></div></div>)}</section><aside className="card h-fit p-6"><h2 className="text-xl font-bold">Order summary</h2>{[['Subtotal',subtotal],['Shipping',shipping],['Tax',tax]].map(([k,v])=><div className="mt-4 flex justify-between text-slate-500" key={k}><span>{k}</span><span>{money(v)}</span></div>)}<div className="mt-5 flex justify-between border-t border-slate-200 pt-5 text-lg font-black"><span>Total</span><span>{money(total)}</span></div><button disabled={!items.length} onClick={()=>setOpen(true)} className="mt-6 w-full rounded-lg bg-pulse py-3 font-bold text-white disabled:opacity-40">Secure checkout</button><p className="mt-3 text-center text-xs text-slate-500">Your payment details stay protected.</p></aside></div>}{open&&!confirmed&&<div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/35 p-4"><form onSubmit={e=>{e.preventDefault();setConfirmed(true);setOpen(false)}} className="card w-full max-w-lg p-7"><div className="flex items-start justify-between"><div><p className="eyebrow">Secure checkout</p><h2 className="mt-1 text-2xl font-black">Payment details</h2></div><button type="button" onClick={()=>setOpen(false)} className="text-xl text-slate-500">×</button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold sm:col-span-2">Email<input required type="email" className={field} placeholder="you@example.com"/></label><label className="text-sm font-semibold sm:col-span-2">Cardholder name<input required className={field} placeholder="Name on card"/></label><label className="text-sm font-semibold sm:col-span-2">Card number<input required inputMode="numeric" className={field} placeholder="4242 4242 4242 4242"/></label><label className="text-sm font-semibold">Expiry date<input required className={field} placeholder="MM / YY"/></label><label className="text-sm font-semibold">CVC<input required inputMode="numeric" className={field} placeholder="123"/></label></div><div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5"><span className="font-bold">Total {money(total)}</span><button className="rounded-lg bg-neon px-5 py-3 font-bold text-white">Confirm order</button></div></form></div>}</main>}
function App(){const [items,setItems]=useState([]);const value=useMemo(()=>({items,setItems,add:(product,customizations)=>setItems(a=>[...a,{product,customizations,quantity:1}])}),[items]);return <CartContext.Provider value={value}><Layout><Routes><Route path="/" element={<Home/>}/><Route path="/peripherals/:type" element={<PeripheralCollection/>}/><Route path="/products/:slug" element={<ProductDetail/>}/><Route path="/cart" element={<Cart/>}/></Routes></Layout></CartContext.Provider>};createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);

# ECO Gaming Electronics

## Run locally

1. Import `database/schema.sql` followed by `database/seed.sql` into MySQL 8.
2. Copy `server/.env.example` to `server/.env` and set database credentials.
3. Run `npm install`, then `npm install --prefix server` and `npm install --prefix client`.
4. Run `npm run dev` and open `http://localhost:5173`.

The API exposes `GET /api/products`, `GET /api/products/:id`, and transactional `POST /api/orders`.

## Deploy the storefront to Vercel

This repository includes a root `vercel.json`. It installs the client dependencies, builds the Vite app from `client`, publishes `client/dist`, and rewrites every browser route to `index.html`. That means direct links such as `/products/aegis-apex-v1` and `/peripherals/keyboards` work after deployment.

1. Create a GitHub repository and push this project to it.
2. In Vercel, select **Add New → Project**, import the repository, and click **Deploy**. Leave the project root as the repository root; `vercel.json` supplies the build settings.
3. After deployment, open the generated domain and test a direct product URL in a new tab.

The hosted storefront and its demo checkout require no environment variables. The current checkout is a UI demo and does not charge cards or persist orders.

For real orders, deploy `server` to a persistent Node host and import `database/schema.sql` then `database/seed.sql` into MySQL. Add `VITE_API_URL=https://your-api.example/api` to Vercel environment variables, set `CLIENT_ORIGIN=https://your-vercel-domain.vercel.app` on the API host, and connect a real Stripe Payment Element before collecting card details.

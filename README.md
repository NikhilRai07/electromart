# ElectroMart 2.0 — Full-stack demo

A React + Vite storefront with a Spring Boot REST API and MySQL database. The UI has been refreshed with a premium navy/electric-orange look and mobile-responsive styling.

## Added / polished features
- Persistent light/dark theme toggle.
- ElectroBuddy shopping helper: matches requests against the live product catalogue and can filter by product category and budget. It is rule-based demo logic, not a connected external AI model.
- Product comparison for up to 3 products: category, price, rating, description, a demo SAVE5 price, and a clearly labelled rating-to-price value index.
- Wishlist section saved in the browser.
- Demo coupons: `SAVE5` gives 5% off; `SMART10` gives 10% off carts of at least ₹20,000, capped at ₹5,000.
- Search, category filters, maximum-price filter, sorting, cart quantity controls, login/register, and existing product CRUD manager.

**Important:** Coupons and prices are demo-only. Checkout does not process payments. ElectroBuddy uses catalogue data and local rules; it is not connected to a live AI API or live retailer price feed.

## Run with Docker (recommended)
1. Extract the ZIP.
2. Open PowerShell in the extracted project root (the folder containing `docker-compose.yml`).
3. Run:
   ```powershell
   docker compose up --build
   ```
4. Open `http://localhost:5173`.
5. Keep that terminal open while using the site. Press `Ctrl+C` to stop it.

If you are updating an already-extracted project, replace the files under `frontend/src/` with the versions in this ZIP, then run `docker compose up --build` again from the project root.

## Local frontend development (optional)
```powershell
cd frontend
npm install
npm run dev
```
The API should be running at `http://localhost:8082` and MySQL should be available via the root Docker Compose setup.

## Separate User and Admin access (demo)
- **User Login** is for shopping and account registration.
- **Admin Login** opens the Product Control Centre; only an admin JWT can create, update, or delete catalogue products through the API.
- Demo admin credentials: `admin@electromart.com` / `Admin@12345`.
- Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `docker-compose.yml` before any shared/public deployment. These are demo credentials, not production secrets.
- The database seeder adds ten sample products by name without deleting existing catalogue entries.

After updating, run from the project root:

```powershell
docker compose up --build
```


## ElectroMart Nexus UI update
The frontend now includes a neon-glass visual system, animated hero orbit/scanning effects, subtle grid ambience, entrance motion, responsive system-status ribbon, enhanced feature tiles, and refined hover/focus states. Existing flows (catalogue API, user/admin login, CRUD, wishlist, comparison, cart, demo coupons, and ElectroBuddy) are preserved. Animations respect `prefers-reduced-motion`.

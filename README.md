# ElectroMart Nexus — Multi-page demo

A React + Vite storefront with a Spring Boot REST API and MySQL. The frontend includes catalog browsing, product details, cart/checkout, wishlist, sign-in/sign-up, an admin product manager, demo order tracking, exchange/repair/warranty forms, and two local rule-based assistants.

## Run locally (Docker Desktop required)

1. Open PowerShell in this folder (the folder containing `docker-compose.yml`).
2. Start Docker Desktop and wait until it says Docker is running.
3. Run:
   ```powershell
   docker compose up --build -d
   ```
4. Open:
   - Storefront: http://localhost:5173
   - REST API: http://localhost:8082/api/products
   - MySQL host port: `3307` (container port `3306`)
5. To see logs: `docker compose logs -f backend`
6. To stop: `docker compose down` (keeps the database volume); to also erase local DB data: `docker compose down -v`.

## Demo admin

- Email: `admin@electromart.com`
- Password: `Admin@12345`
- Admin portal: http://localhost:5173/admin/login

These credentials and secrets are for local demonstration only. Before any public deployment, use unique strong secrets, configure them as host environment variables, and do not publish them in source control.

## Routes

- `/` home
- `/products`, `/product/:id` catalogue and detail
- `/cart`, `/checkout`, `/orders`, `/wishlist`
- `/login`, `/signup`
- `/admin/login`, `/admin`
- `/exchange`, `/repair`, `/warranty`

## Important demo limitations

- Product catalogue, user credentials and admin product CRUD use the Spring Boot API + MySQL.
- Cart, wishlist, demo orders, service requests and their statuses are stored in browser local storage in this version. They are not shared between different users/devices and will not be suitable for production order fulfilment.
- Payment choices are simulations; no payment is processed. Repair/exchange/warranty flows do not contact a real technician or provider.
- The assistants are rule-based demos, not live AI agents.
- For a real public store, implement server-side order/service tables and ownership/authorization, payment gateway integration, email notifications, rate limiting, monitoring, and production database backups.

## Public deployment outline

Deploy the frontend as a static site and the Spring Boot API as a separate web service; use a managed MySQL database. Configure `VITE_API_URL` at frontend build time to point to the deployed API base URL (ending in `/api`). Configure the backend's `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `FRONTEND_ORIGIN`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the API host's environment settings. Set CORS to the exact deployed frontend origin. Never use the demo credentials or database passwords on the public internet.


## Aura Edition updates

This edition adds a brand-focused home page (without product cards or prices), a green/violet light-and-dark visual system, product comparison, a product combination builder, and a backend-backed customer review workflow.

### Added routes
- `/` — Aura Edition home page
- `/shop` and `/products` — catalogue loaded from the backend
- `/products/:id` and `/product/:id` — product details
- `/compare` — compare up to four catalogue products
- `/product-combinations` — manually combine products and total their listed prices
- `/reviews` — view reviews submitted through the review API

### Review API
- `GET /api/reviews` — all submitted reviews and aggregate summary
- `GET /api/products/{productId}/reviews` — reviews for one product and aggregate summary
- `POST /api/reviews` — submit a review

Review submission expects `productId`, `reviewerName`, `rating` (1–5), `title` (optional), and `comment` (5–2000 characters). Reviews are persisted by Spring Data JPA in the `product_reviews` table. Since this project does not currently enforce customer authentication for review submissions, reviews are displayed as visitor-submitted feedback and are **not** marked as verified purchases.

### Run locally
From the project root, run `docker compose up --build`. The frontend is exposed on `http://localhost:5173`, the API on `http://localhost:8082`, and MySQL on host port `3307`. The Docker Compose credentials and administrator credentials are for local development only; change them and configure a long random `JWT_SECRET` before deploying publicly.

The catalogue requires the backend API. If the API is offline, the frontend shows empty/error states rather than silently substituting a fabricated catalogue. Checkout remains a local browser draft until a real order API and payment provider are integrated; it does not process live payments or send real orders.

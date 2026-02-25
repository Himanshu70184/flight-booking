
  # Flight Booking Landing Page

  This is a code bundle for Flight Booking Landing Page. The original project is available at https://www.figma.com/design/Z5KUmQ2D2eoiA1GpYAN8Bq/Flight-Booking-Landing-Page.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

    ## CMS + MongoDB setup

    This project now includes a backend CMS API for dynamic content management.

    ### Frontend env

    1. Copy `.env.example` to `.env`
    2. Set:
      - `VITE_API_BASE_URL=http://localhost:4000/api`

    ### Backend env

    1. Go to `server/`
    2. Copy `.env.example` to `.env`
    3. Set:
      - `MONGODB_URI=mongodb://127.0.0.1:27017/aviotixx-cms`
      - `PORT=4000`
      - `CORS_ORIGIN=http://localhost:5173`

    ### Install backend dependencies

    - Run `npm install --prefix server`

    ### Run both apps

    - Frontend: `npm run dev:frontend`
    - Backend: `npm run dev:backend`

    ### CMS dashboard

    Open `/admin` in the frontend app to manage:
    - Blogs
    - Testimonials
    - FAQs
    - SEO metadata
    - Contact details

    ### Admin credentials

    Admin users are now stored in MongoDB collection: `adminusers`.

    On first backend start, a default admin is seeded from `server/.env`:
    - `ADMIN_EMAIL` (default: `admin@aviotixx.com`)
    - `ADMIN_PASSWORD` (default: `Admin@12345`)

    Dashboard URL:
    - `http://localhost:5175/admin` (or your current Vite port)
  
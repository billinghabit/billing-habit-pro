# 🧾 Billing Habit Pro - Retail Quoting & Inventory System

## 🌟 Project Overview

**Billing Habit Pro** is a modern, decoupled MERN stack application designed for small to medium retailers (Hardware, Electrical, Grocery, etc.) to efficiently manage inventory, create professional price quotations (bills), and track essential profit margins securely.

The application is built with a strong focus on maintainability, utilizing a clear component structure (Pages vs. Components) and modern React/Express architecture.

## 🚀 Key Features

* **Decoupled MERN Stack:** Separate and scalable frontend (React/Vite) and backend (Node.js/Express).
* **Flexible Quotation:** Instantly toggle between **Retail and Wholesale** pricing modes during billing.
* **Price Overrides:** Allow manual modification of price and quantity per item while tracking its deviation from the master price ("Modified" tag).
* **Unit Management:** Products support various units (pcs, kg, mtr, set) which persist throughout the billing and database layers.
* **Profit Security:** Sensitive profit metrics are locked behind a user-defined PIN.
* **PWA Ready:** Optimized for mobile deployment (Add to Home Screen) and offline capabilities.
* **PDF Generation:** Generate clean, print-ready PDF invoices directly from the review page.
* **Inventory Structure:** Nested management system for Categories $\rightarrow$ Sub-Categories $\rightarrow$ Products.

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Axios | Fast development environment with modular components (PWA Ready). |
| **Styling** | Tailwind CSS | Utility-first CSS for rapid, responsive UI development. |
| **Backend** | Node.js, Express, Mongoose | Robust and scalable API server. |
| **Database** | MongoDB | NoSQL database, hosted via MongoDB Atlas. |
| **Auth** | Firebase Authentication | Secure and easy Google Sign-in. |
| **Payments** | Razorpay | Integration for handling PRO subscription payments. |

## 📦 Local Development Setup

To run this project locally, you need two separate processes running: the Backend API and the Frontend Client.

### Prerequisites

1.  Node.js (LTS version) & npm
2.  MongoDB instance (recommended: **MongoDB Atlas**)
3.  A Google/Firebase project for Authentication.

### 1. Backend Setup (`server/`)

1.  Navigate to the `server/` directory and install dependencies:
    ```bash
    cd server
    npm install
    ```
2.  Create a `.env` file in the `server/` directory and fill it with secure keys and configuration:
    ```ini
    # ⚠️ WARNING: REPLACE ALL EXAMPLE VALUES BELOW WITH YOUR OWN SECRETS ⚠️

    # --- Server Configuration ---
    PORT=8080
    NODE_ENV=development

    # --- MongoDB ---
    # Replace the example string with your MongoDB Atlas connection URI
    MONGO_URI=mongodb+srv://<db_user>:<password>@cluster0.nyzqqma.mongodb.net/
    JWT_SECRET=your_long_and_random_jwt_secret_key
    
    # --- Frontend Origin (For CORS in Development) ---
    FRONTEND_URL=[http://billinghabit.vercel.app](http://billinghabit.vercel.app) # Example deployment URL for CORS checks

    # --- Payment Keys ---
    RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
    RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

    # --- Subscription Logic ---
    TRIAL_DAYS=90
    MONTHLY_BILLING_PRICE=199
    MONTHLY_BILLING_DAYS=30
    ANNUAL_BILLING_PRICE=999
    ANNUAL_BILLING_DAYS=365
    ```
3.  Start the API server:
    ```bash
    npm start
    ```
    The API should now be running at `http://localhost:8080`.

### 2. Frontend Setup (`client/`)

1.  Navigate to the `client/` directory and install dependencies:
    ```bash
    cd ../client
    npm install
    ```
2.  Create a `.env` file in the `client/` directory and fill it with the necessary public keys and endpoints:
    ```ini
    # --- API URL ---
    VITE_BACKEND_URL='http://localhost:8080/api'
    
    # --- Razorpay (Public Key) ---
    VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx 

    # --- Firebase Configuration ---
    # These variables are safe to share as they are client-side credentials
    REACT_APP_FIREBASE_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    REACT_APP_FIREBASE_AUTH_DOMAIN="xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    REACT_APP_FIREBASE_PROJECT_ID="xxxxxxxxxxxxxx"
    REACT_APP_FIREBASE_STORAGE_BUCKET="xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="xxxxxxxxxxxxxx"
    REACT_APP_FIREBASE_APP_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    REACT_APP_FIREBASE_MEASUREMENT_ID="xxxxxxxxxxxxxx"
    ```
3.  Start the React development server:
    ```bash
    npm run dev
    ```
    The application will open, typically at `http://localhost:5173`.

## 📂 Code Structure & Maintainability

The frontend code is structured using the **Smart Component/Dumb Component pattern** to ensure high readability and maintainability.

| Folder | Purpose | Examples |
| :--- | :--- | :--- |
| `src/pages/` | **Smart Containers:** Manage state, fetch data, handle business logic, and use hooks. | `FinalQuotation.jsx`, `History.jsx`, `Login.jsx` |
| `src/components/` | **Dumb Components:** Pure UI elements and shared visual blocks. | `QuoteItemRow.jsx`, `Button.jsx`, `Navbar.jsx` |
| `src/config/` | **Configuration:** Centralized constants and API settings. | `constants.js` (for status colors, API base URL). |
| `src/context/` | **Global State:** Manages user session, cart, and selected customer. | `AppContext.jsx` |

---

## 🔒 Deployment

The application is ready for production deployment. The recommended deployment pipeline is:

1.  **Database:** MongoDB Atlas
2.  **Backend (API):** **Render** or **Railway** (Handles Node.js server and MongoDB connection).
3.  **Frontend (Build):** **Vercel** or **Netlify** (Serves the static `dist/` folder built by Vite).

---

## 🤝 Contribution

If you or other developers wish to contribute, please follow the standard Git flow:
1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/new-feature`).
3.  Commit your changes (`git commit -m 'feat: added new feature X'`).
4.  Push to the branch (`git push origin feature/new-feature`).
5.  Open a Pull Request.

**Thank you for building with Billing Habit Pro!**
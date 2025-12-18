import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAppContext } from "./context/AppContext.jsx";

// Pages
import Home from "./pages/dashboard/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import SubCategory from "./pages/inventory/SubCategory.jsx";
import Product from "./pages/inventory/Product.jsx";
import ManageProducts from "./pages/inventory/ManageProducts.jsx";
import Customer from "./pages/billing/Customer.jsx";
import FinalQuotation from "./pages/billing/FinalQuotation.jsx";
import QuoteDetails from "./pages/billing/QuoteDetails.jsx";
import History from "./pages/dashboard/History.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import Subscription from "./pages/dashboard/Subscription.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import InviteFriend from "./pages/other/InviteFriend.jsx";
import ContactUs from "./pages/other/ContactUs.jsx";
import Legal from "./pages/other/Legal.jsx";

/* ------------------- PWA Detection ------------------- */
const isPWA = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

/* ------------------- Route Guards ------------------- */
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAppContext();
  if (loading) return null;
  return user ? element : <Navigate to="/login" replace />;
};

const PremiumRoute = ({ element }) => {
  const { user, loading } = useAppContext();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isPremium) return <Navigate to="/pro" replace />;
  return element;
};

/* ------------------- Root Redirect ------------------- */
const RootRedirect = () => {
  const { user, loading } = useAppContext();

  if (loading) return null;

  // 1. If the app IS a PWA (standalone mode), send them directly to the app dashboard.
  if (isPWA()) {
    return <Navigate to={user ? "/home" : "/login"} replace />;
  }
  
  // 2. If the app is NOT a PWA, check if the user is already logged in.
  if (user) {
      return <Navigate to="/home" replace />;
  }

  // 3. If a regular web user and NOT logged in, show the landing page.
  return <Navigate to="/landing-page" replace />;
};

/* ------------------- App ------------------- */
const App = () => {
  const { user, setUser } = useAppContext();

  return (
    <div className="w-full min-h-screen overflow-hidden bg-bgColor">
      <Toaster position="top-center" />

      <Routes>
        {/* Root */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public */}
        <Route path="/landing-page" element={<LandingPage />} /> 
        <Route path="/login" element={!user ? (<Login onLoginSuccess={setUser} />) : (<Navigate to="/home" replace />)}/>

        {/* Protected */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/sub-category/:categoryId" element={<ProtectedRoute element={<SubCategory />} />} />
        <Route path="/customer" element={<ProtectedRoute element={<Customer />} />} />
        <Route path="/manage-products" element={<ProtectedRoute element={<ManageProducts />} />} />
        <Route path="/history" element={<ProtectedRoute element={<History />} />} />
        <Route path="/quote-details/:quoteId" element={<ProtectedRoute element={<QuoteDetails />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

        {/* Premium */}
        <Route path="/products/:subCategoryId" element={<PremiumRoute element={<Product />} />} />
        <Route path="/view-quote" element={<PremiumRoute element={<FinalQuotation />} />} />
        <Route path="/pro" element={<ProtectedRoute element={<Subscription />} />} />

        {/* Other */}
        <Route path="/invite" element={<ProtectedRoute element={<InviteFriend />} />} />
        <Route path="/contact" element={<ProtectedRoute element={<ContactUs />} />} />
        <Route path="/legal" element={<Legal />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
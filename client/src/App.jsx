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

  // 🌐 Web browser
  if (!isPWA()) {
    return <Navigate to="/landing-page" replace />;
  }

  // 📱 Installed PWA
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/home" replace />;
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
        <Route path="/login" element={!user ? (<Login onLoginSuccess={setUser} />) : (<Navigate to="/home" replace />)}/>
        <Route path="/landing-page" element={<LandingPage />} />

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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/home";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import DestinationDetail from "./pages/DestinationDetail";
import AllDestinations from "./pages/AllDestinations";
import AllTours from "./pages/AllTours";
import TourDetail from "./pages/TourDetail";

function App() {
  const GOOGLE_CLIENT_ID = "283082192970-2qa2p6ocps4fevkfbsn55t4gq6b1kglf.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/destinations" element={<AllDestinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/tours" element={<AllTours />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;

import React from "react";
import Navbar from "../components/guest/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/guest/Footer";

const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default GuestLayout;

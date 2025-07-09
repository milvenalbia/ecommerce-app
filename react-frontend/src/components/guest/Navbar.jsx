import React, { useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const navigationItems = [
    {
      name: "Featured",
      link: "#",
    },
    {
      name: "Men",
      link: "#",
    },
    {
      name: "Women",
      link: "#",
    },
    {
      name: "Shoes",
      link: "#",
    },
    {
      name: "Phones",
      link: "#",
    },
  ];

  return (
    <nav className="bg-[#1f1f21] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Shopping</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="text-white hover:text-gray-300 px-3 py-2 text-[16px] font-semibold transition-colors duration-200 hover:bg-gray-800 rounded-md"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <button
                    onClick={logout}
                    className="text-sm font-semibold hover:text-gray-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold hover:text-gray-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-semibold hover:text-gray-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Shopping Bag */}
            <button className="p-2 rounded-md text-white hover:text-gray-300 hover:bg-gray-800 transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-white hover:text-gray-300 hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900">
          {/* Mobile Navigation Items */}
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="text-white hover:text-gray-300 hover:bg-gray-800 block px-3 py-2 text-base font-medium rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Wishlist */}
          <button className="sm:hidden w-full text-left text-white hover:text-gray-300 hover:bg-gray-800 px-3 py-2 text-base font-medium rounded-md transition-colors flex items-center justify-between">
            <span className="flex items-center">
              <Heart className="h-5 w-5 mr-3" />
              Wishlist
            </span>
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay (Alternative approach) */}
      {isMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-900 border-t border-gray-700">
            {/* Additional mobile menu content can go here */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

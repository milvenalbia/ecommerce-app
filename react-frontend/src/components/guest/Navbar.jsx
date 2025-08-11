import { useState } from "react";
import { Link, NavLink } from "react-router";
import {
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Home,
  ShoppingCart,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";
import { useCartStore } from "../../store/cartStore.js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { totalItems } = useCartStore();

  const navigationItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home size={20} />,
    },
    {
      name: "Shop",
      link: "/shops",
      icon: <ShoppingBag size={20} />,
    },
    // {
    //   name: "Featured",
    //   link: "#",
    // },
    // {
    //   name: "Men",
    //   link: "#",
    // },
    // {
    //   name: "Women",
    //   link: "#",
    // },
    // {
    //   name: "Shoes",
    //   link: "#",
    // },
    // {
    //   name: "Phones",
    //   link: "#",
    // },
  ];

  return (
    <nav className="bg-white text-black sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">ShopZone</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.link}
                  className={`px-3 py-2 text-lg font-semibold transition duration-200 rounded-md items-center gap-3 `}
                >
                  {({ isActive }) => (
                    <div className="relative flex flex-col group">
                      <span>{item.name}</span>
                      <span
                        className={`absolute left-0 -bottom-1 h-1 bg-black transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Shopping Bag */}
            <Link
              to={"/carts"}
              className="p-2 rounded-md text-black hover:text-white hover:bg-gray-800 transition-colors relative cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <p className="text-sm font-semibold inline-flex items-center gap-1">
                    <User />
                    {user.name}
                  </p>
                  <button
                    onClick={logout}
                    className="text-sm font-semibold hover:text-gray-500 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold hover:text-gray-500"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-semibold hover:text-gray-500"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

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
          {/* <button className="sm:hidden w-full text-left text-white hover:text-gray-300 hover:bg-gray-800 px-3 py-2 text-base font-medium rounded-md transition-colors flex items-center justify-between">
            <span className="flex items-center">
              <Heart className="h-5 w-5 mr-3" />
              Wishlist
            </span>
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button> */}
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

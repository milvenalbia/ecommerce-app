import React, { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
  Heart,
  ArrowUp,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section with Features */}
        <div className="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-blue-600 rounded-full group-hover:bg-blue-500 transition-colors duration-300">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Free Shipping</h3>
                  <p className="text-slate-300 text-sm">On orders over $99</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-green-600 rounded-full group-hover:bg-green-500 transition-colors duration-300">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Easy Returns</h3>
                  <p className="text-slate-300 text-sm">30-day return policy</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-purple-600 rounded-full group-hover:bg-purple-500 transition-colors duration-300">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Payment</h3>
                  <p className="text-slate-300 text-sm">
                    SSL protected checkout
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-red-600 rounded-full group-hover:bg-red-500 transition-colors duration-300">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">24/7 Support</h3>
                  <p className="text-slate-300 text-sm">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">ShopZone</h2>
                </div>
                <p className="text-slate-300 mt-4 leading-relaxed max-w-md">
                  Discover amazing products at unbeatable prices. Your one-stop
                  destination for quality, style, and convenience.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>hello@shopzone.com</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span>123 Commerce St, City, State 12345</span>
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Shop</h3>
              <ul className="space-y-3">
                {[
                  "New Arrivals",
                  "Best Sellers",
                  "Electronics",
                  "Fashion",
                  "Home & Garden",
                  "Sports & Outdoors",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Customer Service</h3>
              <ul className="space-y-3">
                {[
                  "Contact Us",
                  "FAQ",
                  "Shipping Info",
                  "Returns",
                  "Size Guide",
                  "Track Order",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Company</h3>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Careers",
                  "Press",
                  "Privacy Policy",
                  "Terms of Service",
                  "Accessibility",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Copyright */}
              <div className="text-slate-400 text-center lg:text-left">
                <p>
                  &copy; {new Date().getFullYear()} ShopZone. All rights
                  reserved.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-6">
                <span className="text-slate-400 text-sm">Follow us:</span>
                {[
                  { Icon: Facebook, color: "hover:text-blue-400" },
                  { Icon: Twitter, color: "hover:text-sky-400" },
                  { Icon: Instagram, color: "hover:text-pink-400" },
                  { Icon: Youtube, color: "hover:text-red-400" },
                ].map(({ Icon, color }, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`text-slate-400 ${color} transition-all duration-300 transform hover:scale-110`}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="flex items-center space-x-4">
                <span className="text-slate-400 text-sm">We accept:</span>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-8 h-8 text-slate-400" />
                  <div className="flex space-x-1">
                    <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center font-bold">
                      V
                    </div>
                    <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center font-bold">
                      M
                    </div>
                    <div className="w-8 h-5 bg-blue-500 rounded text-xs flex items-center justify-center font-bold">
                      AE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg transition-all duration-500 transform z-20
        ${
          isVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-0 pointer-events-none"
        }
        hover:shadow-xl hover:scale-110`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}

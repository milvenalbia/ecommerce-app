import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import dayjs from "dayjs";
import { useAuthStore } from "../../store/authStore";
import BlankProfile from "../../assets/blank_profile.png";
const Header = () => {
  const location = useLocation();
  const [now, setNow] = useState(new Date());
  const { user } = useAuthStore();

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/products": "Products",
    "/admin/orders": "Orders",
    "/admin/payments": "Payments",
    "/admin/reports": "Order Reports",
    "/admin": "Dashboard",
  };

  const getCurrentPageTitle = () => {
    // Get the current pathname from the location object
    const pathname = location.pathname;

    // Check for exact matches first
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }

    if (pathname === "/admin") {
      return "Dashboard";
    }

    const matchedLink = Object.keys(pageTitles).find(
      (key) => pathname.startsWith(key) && key !== "/admin"
    );
    if (matchedLink) {
      return pageTitles[matchedLink];
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("dddd, MMMM D, YYYY – h:mm A");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <header className="w-full h-20 sticky top-3">
      <div className="bg-white shadow-md w-full h-20 rounded-lg flex justify-between items-center px-5">
        <h1 className="text-2xl font-bold text-black">
          {getCurrentPageTitle()}
        </h1>
        <span>{formatDate(now)}</span>
        <div className="flex gap-6 items-center">
          <div className="relative">
            <span className="absolute w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white -top-3 -right-2">
              20
            </span>
            <span>
              <Bell />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="rounded-full w-9 h-9"
              src={BlankProfile}
              alt="Blank Profile"
            />
            <span className="capitalize font-semibold">{user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

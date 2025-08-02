import {
  DollarSign,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  ScrollText,
  ShoppingBag,
} from "lucide-react";
import { NavLink } from "react-router";
import { useAuthStore } from "../../store/authStore";

const Sidebar = () => {
  const { logout } = useAuthStore();
  const mainLinks = [
    {
      name: "Dashboard",
      link: "dashboard",
      icon: <LayoutDashboard />,
    },
    {
      name: "Products",
      link: "products",
      icon: <Package />,
    },
    {
      name: "Categories",
      link: "categories",
      icon: <FolderTree />,
    },
    {
      name: "Orders",
      link: "orders",
      icon: <ShoppingBag />,
    },
    {
      name: "Payments",
      link: "payments",
      icon: <DollarSign />,
    },
    {
      name: "Order Reports",
      link: "reports",
      icon: <ScrollText />,
    },
  ];
  return (
    <aside className="w-[280px] h-screen bg-white sticky top-0 p-4 shadow-md flex flex-col">
      <header className="h-20 flex justify-center items-center">
        <NavLink to="dashboard" className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <span className="text-xl font-semibold">ShopZone</span>
            </div>
          </div>
        </NavLink>
      </header>

      <div className="flex-1 flex flex-col justify-between">
        <ul className="flex flex-col gap-3 mt-6">
          <li>
            <p className="text-sm font-semibold text-gray-500">
              Main Navigation
            </p>
          </li>
          {mainLinks.map((link, index) => (
            <li key={index} className="font-semibold">
              <NavLink
                to={link.link}
                className={({ isActive }) =>
                  `inline-flex gap-3 w-full py-3 px-4 rounded-md transition ${
                    isActive
                      ? "bg-purple-500 text-white shadow"
                      : "bg-white hover:bg-purple-500/90 hover:text-white hover:shadow"
                  }`
                }
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout button pinned to bottom */}
        <div className="mt-4">
          <button
            onClick={logout}
            className="inline-flex gap-3 text-white cursor-pointer bg-red-500 shadow w-full py-3 px-4 rounded-md hover:bg-red-600 transition"
          >
            <span>
              <LogOut />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, PlusSquare, Heart, List, ShoppingCart, Percent, FileText, Settings 
} from "lucide-react"; // You can install lucide-react for icons

const Sidebar = () => {
  const menu = [
    { path: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { path: "/add", label: "Add Product", icon: <PlusSquare size={18} /> },
    { path: "/dashboard/products", label: "Products", icon: <List size={18} /> },
    { path: "/dashboard/wishlist", label: "Wishlist", icon: <Heart size={18} /> },
    { path: "/dashboard/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { path: "/dashboard/discounts", label: "Discount Coupons", icon: <Percent size={18} /> },
    { path: "/dashboard/blog", label: "Blog", icon: <FileText size={18} /> },
    { path: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 h-full bg-white shadow-md p-4">
      <div className="text-2xl font-bold mb-8 text-blue-600">eCom Admin</div>
      <nav className="flex flex-col space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md font-medium ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

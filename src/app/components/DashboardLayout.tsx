import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  HelpCircle,
  Globe2,
  LogOut,
} from "lucide-react";
import { logoutAdmin } from "../services/contentApi";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5 mr-2" />, path: "/admin/dashboard" },
  { label: "Blogs", icon: <BookOpen className="w-5 h-5 mr-2" />, path: "/admin/blogs" },
  { label: "Testimonials", icon: <MessageCircle className="w-5 h-5 mr-2" />, path: "/admin/testimonials" },
  { label: "FAQs", icon: <HelpCircle className="w-5 h-5 mr-2" />, path: "/admin/faqs" },
  { label: "SEO", icon: <Globe2 className="w-5 h-5 mr-2" />, path: "/admin/seo" },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };
  
  const isActive = (path: string) => {
    if (path === "/admin/dashboard" && (location.pathname === "/admin" || location.pathname === "/admin/")) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <aside className="w-full md:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl p-6">
        <Link to="/admin/dashboard" className="block mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Portal
            </h2>
            <p className="text-sm text-gray-400 mt-1">Flight Booking CMS</p>
          </div>
        </Link>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-102"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-8 border-t border-gray-700 space-y-2">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center p-4 w-full text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all"
          >
            <Globe2 className="w-5 h-5 mr-2" />
            <span>View Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center p-4 w-full text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
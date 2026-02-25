import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, MessageCircle, HelpCircle, Globe2 } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5 mr-2" />, path: "/admin/dashboard" },
  { label: "Blogs", icon: <BookOpen className="w-5 h-5 mr-2" />, path: "/admin/blogs" },
  { label: "Testimonials", icon: <MessageCircle className="w-5 h-5 mr-2" />, path: "/admin/testimonials" },
  { label: "FAQs", icon: <HelpCircle className="w-5 h-5 mr-2" />, path: "/admin/faqs" },
  { label: "SEO", icon: <Globe2 className="w-5 h-5 mr-2" />, path: "/admin/seo" },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
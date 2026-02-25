import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { fetchAdminCollection } from "../services/contentApi";
import { CmsBlog, CmsTestimonial, CmsFaq } from "../types/cms";
import { BookOpen, MessageCircle, HelpCircle, TrendingUp, FileText } from "lucide-react";

const AdminCmsPage: React.FC = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    testimonials: 0,
    faqs: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState<CmsBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [blogs, testimonials, faqs] = await Promise.all([
        fetchAdminCollection<CmsBlog>("blogs"),
        fetchAdminCollection<CmsTestimonial>("testimonials"),
        fetchAdminCollection<CmsFaq>("faqs"),
      ]);
      
      setStats({
        blogs: blogs.length,
        testimonials: testimonials.length,
        faqs: faqs.length,
      });
      
      setRecentBlogs(blogs.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your content.</p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total Blogs</p>
                    <h3 className="text-5xl font-bold">{stats.blogs}</h3>
                    <p className="text-xs opacity-75 mt-2">Published articles</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total Testimonials</p>
                    <h3 className="text-5xl font-bold">{stats.testimonials}</h3>
                    <p className="text-xs opacity-75 mt-2">Customer reviews</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total FAQs</p>
                    <h3 className="text-5xl font-bold">{stats.faqs}</h3>
                    <p className="text-xs opacity-75 mt-2">Help articles</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-white shadow-lg rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-colors">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  Recent Blogs
                </h3>
                {recentBlogs.length > 0 ? (
                  <ul className="space-y-3">
                    {recentBlogs.map((blog) => (
                      <li key={blog._id} className="border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <p className="font-semibold text-gray-800">{blog.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{blog.readTime} read</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No blogs yet</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-white shadow-lg rounded-2xl border-2 border-gray-100 hover:border-green-200 transition-colors">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Total Content Items</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {stats.blogs + stats.testimonials + stats.faqs}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Content Categories</span>
                    <span className="text-3xl font-bold text-green-600">3</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-gray-700 font-medium">System Status</span>
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-semibold">Active</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminCmsPage;


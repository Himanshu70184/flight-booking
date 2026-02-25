import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { fetchSettings, updateSettings } from "../services/contentApi";

const SeoManagementPage: React.FC = () => {
  const [seoSettings, setSeoSettings] = useState({
    title: "",
    description: "",
    keywords: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCurrentSettings();
  }, []);

  const fetchCurrentSettings = async () => {
    try {
      const data = await fetchSettings();
      if (data.seo) {
        setSeoSettings(data.seo);
      }
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeoSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const currentSettings = await fetchSettings();
      await updateSettings({ seo: seoSettings, contact: currentSettings.contact });
      setMessage("SEO settings saved successfully!");
    } catch (error) {
      setMessage("Error saving SEO settings. Please try again.");
      console.error("Error saving SEO settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Manage SEO</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={seoSettings.title}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter SEO title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={seoSettings.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter SEO description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Keywords</label>
          <input
            type="text"
            name="keywords"
            value={seoSettings.keywords}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter SEO keywords"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
        {message && (
          <p className={`mt-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}
      </form>
    </DashboardLayout>
  );
};

export default SeoManagementPage;
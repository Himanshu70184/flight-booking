import React, { useEffect, useState } from "react";
import { fetchAdminCollection, createAdminItem, updateAdminItem, deleteAdminItem } from "../services/contentApi";
import { CmsTestimonial } from "../types/cms";
import DashboardLayout from "../components/DashboardLayout";
import { X, Plus, Upload, Edit2, Trash2, Star } from "lucide-react";
import { uploadImage } from "../services/uploadService";

const TestimonialManagementPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: "", location: "", review: "", rating: 5, customerPhoto: "" });
  const [editingTestimonial, setEditingTestimonial] = useState<CmsTestimonial | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminCollection<CmsTestimonial>("testimonials");
      setTestimonials(data);
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      setError(error.message || "Failed to load testimonials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestimonial = async () => {
    try {
      setUploading(true);
      let photoUrl = newTestimonial.customerPhoto;
      
      if (imageFile) {
        photoUrl = await uploadImage(imageFile, 'testimonial');
      }
      
      const created = await createAdminItem("testimonials", { ...newTestimonial, customerPhoto: photoUrl }) as CmsTestimonial;
      setTestimonials([...testimonials, created]);
      setNewTestimonial({ name: "", location: "", review: "", rating: 5, customerPhoto: "" });
      setImageFile(null);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      alert("Failed to create testimonial. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial || !editingTestimonial._id) return;
    try {
      setUploading(true);
      let photoUrl = editingTestimonial.customerPhoto;
      
      // Upload new image if selected
      if (editImageFile) {
        photoUrl = await uploadImage(editImageFile, 'testimonial');
      }
      
      const updated = await updateAdminItem("testimonials", editingTestimonial._id, { ...editingTestimonial, customerPhoto: photoUrl });
      setTestimonials(testimonials.map((t) => (t._id === updated._id ? updated : t)));
      setEditingTestimonial(null);
      setEditImageFile(null);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      alert("Failed to update testimonial. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await deleteAdminItem("testimonials", id);
      setTestimonials(testimonials.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Testimonials</h1>
            <p className="text-gray-600 mt-1">Create and manage customer testimonials</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create New Testimonial
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading testimonials...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-1">Failed to Load Testimonials</h3>
                <p className="text-red-700 text-sm mb-3">{error}</p>
                <button
                  onClick={fetchTestimonials}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials List - Grid View */}
        {!loading && !error && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
                <div className="flex items-start gap-4 mb-4">
                  {testimonial.customerPhoto ? (
                    <img 
                      src={testimonial.customerPhoto} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=3b82f6&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-4">{testimonial.review}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTestimonial(testimonial)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => testimonial._id && handleDeleteTestimonial(testimonial._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No testimonials yet. Create your first testimonial!</p>
          </div>
        ) : null}

        {/* Create Testimonial Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Testimonial</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={newTestimonial.location}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Review</label>
                  <textarea
                    placeholder="Customer review or feedback"
                    value={newTestimonial.review}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, review: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                        className="p-2 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= newTestimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="testimonial-image-upload"
                    />
                    <label htmlFor="testimonial-image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload photo</p>
                      {imageFile && <p className="text-xs text-blue-600 font-medium">{imageFile.name}</p>}
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTestimonial}
                    disabled={uploading}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Creating...' : 'Create Testimonial'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setEditingTestimonial(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Testimonial</h2>
              <button
                onClick={() => setEditingTestimonial(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  value={editingTestimonial.location}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review</label>
                <textarea
                  placeholder="Review"
                  value={editingTestimonial.review}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, review: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: star })}
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= editingTestimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Photo</label>
                {editingTestimonial.customerPhoto && !editImageFile && (
                  <div className="mb-3 rounded-xl overflow-hidden">
                    <img src={editingTestimonial.customerPhoto} alt="Current" className="w-32 h-32 object-cover mx-auto" />
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="testimonial-image-upload-edit"
                  />
                  <label htmlFor="testimonial-image-upload-edit" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload new photo</p>
                    {editImageFile && <p className="text-xs text-blue-600 font-medium">{editImageFile.name}</p>}
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditingTestimonial(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTestimonial}
                  disabled={uploading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Updating...' : 'Update Testimonial'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default TestimonialManagementPage;
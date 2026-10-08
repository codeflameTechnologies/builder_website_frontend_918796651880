import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAdmin, getAdminInfo } from "../api/auth";
import {
  getAllProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../api/properties";
import { uploadImages } from "../api/upload";
import { getEnquiries } from "../api/enquiries";

const emptyForm = {
  name: "",
  type: "",
  listingType: "sale",
  price: "",
  location: "",
  status: "available",
  images: [],
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminInfo = getAdminInfo();

  const [activeTab, setActiveTab] = useState("overview");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");

  // image upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllProperties();
      setProperties(data);
    } catch (err) {
      setError("Failed to load properties. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const fetchEnquiries = useCallback(async () => {
    setEnquiriesLoading(true);
    setEnquiryError("");
    try {
      const data = await getEnquiries();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      setEnquiryError(err.response?.data?.message || "Failed to load enquiries.");
    } finally {
      setEnquiriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ---- Image selection + local preview ----
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const remaining = Math.max(0, 6 - form.images.length - selectedFiles.length);
    const accepted = files.filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024).slice(0, remaining);
    if (accepted.length !== files.length) setError("Only images up to 5 MB are allowed, with a maximum of 6 images total.");
    setSelectedFiles((prev) => [...prev, ...accepted]);
    const previews = accepted.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const removeSelectedFile = (index) => {
    setPreviewUrls((prev) => { const url = prev[index]; if (url) URL.revokeObjectURL(url); return prev.filter((_, i) => i !== index); });
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let finalImages = [...form.images];

      // Upload any newly selected files to Cloudinary first
      if (selectedFiles.length > 0) {
        setUploading(true);
        const uploadedUrls = await uploadImages(selectedFiles);
        finalImages = [...finalImages, ...uploadedUrls];
        setUploading(false);
      }

      const payload = { ...form, images: finalImages };

      if (editingId) {
        await updateProperty(editingId, payload);
      } else {
        await createProperty(payload);
      }

      await fetchProperties();
      resetForm();
      setActiveTab("properties");
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || "Failed to save property.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setForm({ ...emptyForm, images: [] });
    setEditingId(null);
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleEdit = (property) => {
    setForm({ ...emptyForm, ...property, images: property.images || [] });
    setEditingId(property._id);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setActiveTab("add");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this property?")) return;
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete property.");
    }
  };

  const toggleStatus = async (property) => {
    const newStatus = property.status === "available" ? "sold" : "available";
    try {
      const updated = await updateProperty(property._id, { ...property, status: newStatus });
      setProperties((prev) => prev.map((p) => (p._id === property._id ? updated : p)));
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const stats = [
    { label: "Total Properties", value: properties.length, icon: "🏠" },
    { label: "For Sale", value: properties.filter((p) => p.listingType === "sale").length, icon: "🏷️" },
    { label: "For Rent", value: properties.filter((p) => p.listingType === "rent").length, icon: "🔑" },
    { label: "Sold / Unavailable", value: properties.filter((p) => p.status === "sold").length, icon: "✅" },
    { label: "Total Enquiries", value: enquiries.length, icon: "📩" },
  ];

  const navItems = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "properties", label: "Properties", icon: "🏢" },
    { key: "add", label: editingId ? "Edit Property" : "Add Property", icon: "➕" },
    { key: "enquiries", label: "Enquiries", icon: "📩" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-blue-950 text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <span className="text-xl font-bold">ABC <span className="text-amber-400">Builders</span></span>
          <p className="text-xs text-gray-400 mt-1">
            {adminInfo?.name ? `Welcome, ${adminInfo.name}` : "Admin Dashboard"}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === "add") resetForm();
                setActiveTab(item.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.key ? "bg-white text-blue-950" : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-xl">☰</button>
            <h1 className="text-lg font-bold text-gray-900 capitalize">
              {activeTab === "add" ? (editingId ? "Edit Property" : "Add Property") : activeTab}
            </h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-950 text-white flex items-center justify-center text-sm font-bold">
            {adminInfo?.name?.[0]?.toUpperCase() || "A"}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading properties...</div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
                      <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="text-2xl mb-2">{s.icon}</div>
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="font-bold text-gray-900 mb-4">Recent Properties</h2>
                    <div className="space-y-3">
                      {properties.slice(0, 5).map((p) => (
                        <div key={p._id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                          <img
                            src={p.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100"}
                            alt={p.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.type} • {p.location}</p>
                          </div>
                          <span className="text-sm font-semibold text-blue-900">{p.price}</span>
                        </div>
                      ))}
                      {properties.length === 0 && (
                        <p className="text-sm text-gray-400">No properties yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "enquiries" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100">
                      <div>
                        <h2 className="font-bold text-gray-900">Customer Enquiries ({enquiries.length})</h2>
                        <p className="text-sm text-gray-500 mt-1">Leads submitted from the website forms.</p>
                      </div>
                      <button
                        onClick={fetchEnquiries}
                        disabled={enquiriesLoading}
                        className="px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-60"
                      >
                        {enquiriesLoading ? "Refreshing..." : "↻ Refresh"}
                      </button>
                    </div>

                    {enquiryError && (
                      <div className="m-5 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
                        {enquiryError}
                      </div>
                    )}

                    {enquiriesLoading ? (
                      <div className="text-center py-16 text-gray-400">Loading enquiries...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                              <th className="text-left px-5 py-3">Customer</th>
                              <th className="text-left px-5 py-3">Phone</th>
                              <th className="text-left px-5 py-3">Property</th>
                              <th className="text-left px-5 py-3">Type</th>
                              <th className="text-left px-5 py-3">WhatsApp</th>
                              <th className="text-left px-5 py-3">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {enquiries.map((enquiry) => (
                              <tr key={enquiry._id} className="hover:bg-gray-50 align-top">
                                <td className="px-5 py-4">
                                  <p className="font-semibold text-gray-900">{enquiry.name}</p>
                                  <p className="text-xs text-gray-500 mt-1">{enquiry.email}</p>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <a href={`tel:${enquiry.phone}`} className="font-medium text-blue-900 hover:underline">{enquiry.phone}</a>
                                </td>
                                <td className="px-5 py-4">
                                  <p className="font-medium text-gray-900">{enquiry.propertyName || "General Enquiry"}</p>
                                  {enquiry.propertyId && <p className="text-xs text-gray-400 mt-1">Property selected</p>}
                                </td>
                                <td className="px-5 py-4 text-gray-600">{enquiry.propertyType || "—"}</td>
                                <td className="px-5 py-4">
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${enquiry.whatsapp ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {enquiry.whatsapp ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                  {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}
                                </td>
                              </tr>
                            ))}
                            {enquiries.length === 0 && (
                              <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400">
                                  No enquiries yet. New website enquiries will appear here.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "properties" && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-5 flex items-center justify-between border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">All Properties ({properties.length})</h2>
                    <button
                      onClick={() => { resetForm(); setActiveTab("add"); }}
                      className="px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      + Add Property
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                          <th className="text-left px-5 py-3">Photo</th>
                          <th className="text-left px-5 py-3">Name</th>
                          <th className="text-left px-5 py-3">Type</th>
                          <th className="text-left px-5 py-3">Listing</th>
                          <th className="text-left px-5 py-3">Price</th>
                          <th className="text-left px-5 py-3">Location</th>
                          <th className="text-left px-5 py-3">Status</th>
                          <th className="text-right px-5 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {properties.map((p) => (
                          <tr key={p._id} className="hover:bg-gray-50">
                            <td className="px-5 py-3">
                              <img
                                src={p.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100"}
                                alt={p.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                            </td>
                            <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                            <td className="px-5 py-3 text-gray-600">{p.type}</td>
                            <td className="px-5 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                p.listingType === "sale" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {p.listingType === "sale" ? "Sale" : "Rent"}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-gray-900 font-medium">{p.price}</td>
                            <td className="px-5 py-3 text-gray-600">{p.location}</td>
                            <td className="px-5 py-3">
                              <button
                                onClick={() => toggleStatus(p)}
                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  p.status === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                              >
                                {p.status === "available" ? "Available" : "Sold"}
                              </button>
                            </td>
                            <td className="px-5 py-3 text-right space-x-2">
                              <button onClick={() => handleEdit(p)} className="text-blue-900 hover:underline font-medium">Edit</button>
                              <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline font-medium">Delete</button>
                            </td>
                          </tr>
                        ))}
                        {properties.length === 0 && (
                          <tr>
                            <td colSpan={8} className="text-center py-8 text-gray-400">
                              No properties yet. Click "Add Property" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "add" && (
                <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
                  <h2 className="font-bold text-gray-900 mb-1">
                    {editingId ? "Edit Property" : "Add New Property"}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">Fill in the property details below.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Property Name</label>
                      <input
                        type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="e.g. ABC Residency"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Type (e.g. 3 BHK Flat)</label>
                        <input
                          type="text" name="type" required value={form.type} onChange={handleChange}
                          placeholder="3 BHK Flat"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Listing Type</label>
                        <select
                          name="listingType" value={form.listingType} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-none"
                        >
                          <option value="sale">For Sale</option>
                          <option value="rent">For Rent</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Price</label>
                        <input
                          type="text" name="price" required value={form.price} onChange={handleChange}
                          placeholder="₹65 Lakh"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Location</label>
                        <input
                          type="text" name="location" required value={form.location} onChange={handleChange}
                          placeholder="Dwarka, Delhi"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Status</label>
                      <select
                        name="status" value={form.status} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-none"
                      >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                      </select>
                    </div>

                    {/* ---------- PHOTO UPLOAD ---------- */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Photos</label>

                      {/* Already-uploaded images (when editing) */}
                      {form.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {form.images.map((url, i) => (
                            <div key={url} className="relative w-20 h-20">
                              <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                              <button
                                type="button"
                                onClick={() => removeUploadedImage(i)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Newly selected (not-yet-uploaded) files preview */}
                      {previewUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {previewUrls.map((url, i) => (
                            <div key={url} className="relative w-20 h-20">
                              <img src={url} alt="" className="w-full h-full object-cover rounded-lg opacity-80" />
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] bg-black/30 text-white rounded-lg">
                                New
                              </span>
                              <button
                                type="button"
                                onClick={() => removeSelectedFile(i)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <label className="block border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500 cursor-pointer hover:border-blue-900 hover:bg-blue-50/30 transition-colors">
                        📷 Click to select photos (up to 6, max 5MB each)
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                      {uploading && (
                        <p className="text-xs text-blue-900 mt-1">Uploading images to Cloudinary...</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit" disabled={saving}
                        className="px-6 py-2.5 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
                      >
                        {saving ? (uploading ? "Uploading photos..." : "Saving...") : editingId ? "Update Property" : "Add Property"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { resetForm(); setActiveTab("properties"); }}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

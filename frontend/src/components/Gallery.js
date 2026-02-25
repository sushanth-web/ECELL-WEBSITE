import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* ---------- CARD ---------- */
function GalleryCard({ item, isAdmin, onDelete, onView }) {
  return (
    <div
      className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer"
      onClick={onView}
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        className="
          w-full object-cover transition duration-300 group-hover:scale-105
          h-28 min-[360px]:h-32 sm:h-40 md:h-48 lg:h-56
        "
      />

      {isAdmin && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-1.5 right-1.5 z-10 bg-red-600 text-white p-1 rounded-full text-xs"
        >
          🗑️
        </button>
      )}

      {/* Gradient Hover Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />

      {/* Hover Text */}
      <div className="pointer-events-none absolute bottom-1.5 left-1.5 right-1.5 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
        <h3 className="text-[10px] min-[360px]:text-[11px] sm:text-sm font-semibold leading-tight">
          {item.name}
        </h3>
        <p className="text-[9px] min-[360px]:text-[10px] text-gray-300">
          {item.date}
        </p>
      </div>
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */
export default function Gallery() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({ name: "", date: "", image: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gallery");
      setGalleryData(res.data);
    } catch (err) {
      console.error("Fetch gallery error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.image) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("date", formData.date);
      data.append("image", formData.image);

      const res = await api.post("/gallery", data);
      setGalleryData((prev) => [res.data, ...prev]);
      setShowModal(false);
      setFormData({ name: "", date: "", image: null });
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      setGalleryData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  return (
    <section className="bg-slate-50 py-5 sm:py-7">
      {/* ---------- HEADER ---------- */}
      <div className="relative max-w-3xl mx-auto px-3 sm:px-5 text-center mb-6">
        {isAdmin && (
          <button
            onClick={handleLogout}
            className="absolute right-3 top-0 bg-red-600 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm"
          >
            Logout
          </button>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-900">
          Moments That Matter
        </h1>

        <div className="w-12 sm:w-16 h-1 bg-orange-500 mx-auto mt-3 mb-4 rounded-full" />

        <p className="text-slate-600 text-base sm:text-lg md:text-xl">
          Capturing innovation, leadership and unforgettable experiences from
          our events, workshops and startup journeys.
        </p>

        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-blue-600 text-white text-lg px-4 py-2 rounded-md"
          >
            ➕
          </button>
        )}
      </div>

      {/* ---------- GALLERY ---------- */}
      <div
        className="
          max-w-6xl mx-auto px-3 sm:px-5 md:px-8
          grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-3 sm:gap-4
        "
      >
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          galleryData.map((item) => (
            <GalleryCard
              key={item._id}
              item={item}
              isAdmin={isAdmin}
              onDelete={() => handleDelete(item._id)}
              onView={() => setSelectedImage(item)}
            />
          ))
        )}
      </div>

      {/* ---------- IMAGE POPUP ---------- */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-red-700 transition"
            >
              ✕
            </button>

            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.name}
              className="w-full max-h-[70vh] object-contain bg-black"
            />

            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold">
                {selectedImage.name}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedImage.date}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------- ADD MODAL ---------- */}
      {isAdmin && showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm">
            <h2 className="text-sm sm:text-lg font-bold mb-3">
              Add Gallery Image
            </h2>

            <form onSubmit={handleAddImage} className="space-y-3">
              <input
                type="text"
                placeholder="Event Name"
                className="w-full border px-3 py-2 rounded text-sm"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Event Date"
                className="w-full border px-3 py-2 rounded text-sm"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />

              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-3 py-1.5 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                >
                  {uploading ? "Uploading..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
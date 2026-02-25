const mongoose = require("mongoose");
const Gallery = require("../models/galleryModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * ADD IMAGE
 */
const addGalleryData = async (req, res) => {
  try {
    const { name, date } = req.body;
    if (!name || !date) return res.status(400).json({ message: "Name and date are required" });
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "gallery", resource_type: "image" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: "Cloudinary upload failed", error });
        const gallery = await Gallery.create({ name, date, imageUrl: result.secure_url });
        res.status(201).json(gallery);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ALL IMAGES
 */
const getGalleryData = async (req, res) => {
  try {
    const data = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};

/**
 * DELETE IMAGE
 */
const deleteGalleryData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const galleryItem = await Gallery.findById(id);
    if (!galleryItem) return res.status(404).json({ message: "Not found" });

    // Extract public_id from the imageUrl
    // Example: https://res.cloudinary.com/demo/image/upload/v16799999/gallery/abc123.jpg
    const urlParts = galleryItem.imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1]; // abc123.jpg
    const publicId = `gallery/${fileName.split(".")[0]}`; // gallery/abc123

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    // Delete from MongoDB
    await galleryItem.deleteOne();

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Delete failed", error });
  }
};
module.exports = { addGalleryData, getGalleryData, deleteGalleryData };

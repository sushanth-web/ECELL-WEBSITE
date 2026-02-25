const mongoose = require("mongoose");
const teamRegister = require("../models/teamRegister");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * ADD MEMBER
 */
const addMemberData = async (req, res) => {
  try {
    const { name, role, insta, linkedin, facebook } = req.body;
    if (!name || !role) return res.status(400).json({ message: "Name and role are required" });
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const uploadStream = cloudinary.uploader.upload_stream(
  { folder: "team", resource_type: "image" },
  async (error, result) => {
    if (error) return res.status(500).json({ message: "Cloudinary upload failed", error });

    const team = await teamRegister.create({ 
      name, 
      role, 
      insta, 
      linkedin, 
      facebook, 
      imageUrl: result.secure_url,
      imageId: result.public_id // ⬅️ save public_id
    });

    res.status(201).json(team);
  }
);


    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ALL MEMBERS
 */
const getTeamData = async (req, res) => {
  try {
    const data = await teamRegister.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};

/**
 * DELETE MEMBER
 */
const deleteTeamData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(400).json({ message: "Invalid ID" });

    // Find member first
    const member = await teamRegister.findById(id);
    if (!member) return res.status(404).json({ message: "Not found" });

    // Delete from Cloudinary
    if (member.imageId) {
      await cloudinary.uploader.destroy(member.imageId, { resource_type: "image" });
    }

    // Delete from MongoDB
    await teamRegister.findByIdAndDelete(id);

    res.status(200).json({ message: "Deleted from DB and Cloudinary" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};


module.exports = { addMemberData, getTeamData, deleteTeamData };

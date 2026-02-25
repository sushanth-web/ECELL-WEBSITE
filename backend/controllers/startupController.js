const mongoose = require("mongoose");
const Startup = require("../models/startupModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/* ADD STARTUP */
const addStartup = async (req, res) => {
  try {

    const { title, name, desc } = req.body;

    if (!title || !name || !desc)
      return res.status(400).json({ message: "All fields are required" });

    if (!req.file)
      return res.status(400).json({ message: "Image required" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "startups", resource_type: "image" },
      async (error, result) => {

        if (error)
          return res.status(500).json({ message: "Upload failed", error });

        const startup = await Startup.create({
          title,
          name,
          desc,
          imageUrl: result.secure_url
        });

        res.status(201).json(startup);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }
};


/* GET ALL STARTUPS */
const getStartups = async (req, res) => {

  try {

    const startups = await Startup.find().sort({ createdAt: -1 });

    res.status(200).json(startups);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Fetch failed" });

  }

};


/* DELETE STARTUP */
const deleteStartup = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const startup = await Startup.findById(id);

    if (!startup)
      return res.status(404).json({ message: "Startup not found" });

    /* DELETE IMAGE FROM CLOUDINARY */

    const urlParts = startup.imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const publicId = `startups/${fileName.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    await startup.deleteOne();

    res.status(200).json({ message: "Startup deleted successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Delete failed" });

  }

};

module.exports = {
  addStartup,
  getStartups,
  deleteStartup
};
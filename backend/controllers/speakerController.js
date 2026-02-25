const mongoose = require("mongoose");
const Speaker = require("../models/speakerModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");


/* ADD SPEAKER */
const addSpeaker = async (req, res) => {
  try {

    const { name, role, desc } = req.body;

    if (!name || !role || !desc)
      return res.status(400).json({ message: "All fields required" });

    if (!req.file)
      return res.status(400).json({ message: "Image required" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "speakers", resource_type: "image" },
      async (error, result) => {

        if (error)
          return res.status(500).json({ message: "Upload failed", error });

        const speaker = await Speaker.create({
          name,
          role,
          desc,
          imageUrl: result.secure_url
        });

        res.status(201).json(speaker);

      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }
};


/* GET ALL SPEAKERS */
const getSpeakers = async (req, res) => {

  try {

    const speakers = await Speaker.find().sort({ createdAt: -1 });

    res.status(200).json(speakers);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Fetch failed" });

  }

};


/* DELETE SPEAKER */
const deleteSpeaker = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const speaker = await Speaker.findById(id);

    if (!speaker)
      return res.status(404).json({ message: "Speaker not found" });

    const urlParts = speaker.imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const publicId = `speakers/${fileName.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);

    await speaker.deleteOne();

    res.status(200).json({ message: "Deleted successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Delete failed" });

  }

};

module.exports = {
  addSpeaker,
  getSpeakers,
  deleteSpeaker
};
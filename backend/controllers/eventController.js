const mongoose = require("mongoose");
const Events = require("../models/eventModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/* ADD EVENT */
const addEventData = async (req, res) => {
  try {
    const { title, date, desc } = req.body;
    if (!title || !date || !desc)
      return res.status(400).json({ message: "Title, date and description are required" });
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "events", resource_type: "image" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: "Cloudinary upload failed", error });

        const event = await Events.create({
          title,
          date,
          desc,
          imageUrl: result.secure_url,
        });
        res.status(201).json(event);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET EVENTS GROUPED BY TYPE */
const getEventsData = async (req, res) => {
  try {
    const upcoming = await Events.find({ type: "upcoming" }).sort({ createdAt: -1 });
    const past = await Events.find({ type: "past" }).sort({ createdAt: -1 });
    res.status(200).json({ upcoming, past });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* DELETE EVENT */
const deleteEventData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const event = await Events.findById(id);
    if (!event) return res.status(404).json({ message: "Not found" });

    // Delete image from Cloudinary
    const urlParts = event.imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const publicId = `events/${fileName.split(".")[0]}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    await event.deleteOne();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Delete failed", error });
  }
};

/* MARK EVENT AS DONE */
const markEventAsDone = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const event = await Events.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.type = "past";
    await event.save();

    res.status(200).json({ message: "Event moved to past", event });
  } catch (error) {
    console.error("Mark as done error:", error);
    res.status(500).json({ message: "Mark as done failed", error });
  }
};

const addEventPhoto = async (req, res) => {
  try {

    const { id } = req.params;

    if (!req.file)
      return res.status(400).json({ message: "Photo required" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "events/gallery", resource_type: "image" },
      async (error, result) => {

        if (error)
          return res.status(500).json({ message: "Upload failed", error });

        const event = await Events.findById(id);

        if (!event)
          return res.status(404).json({ message: "Event not found" });

        event.gallery.push(result.secure_url);
        await event.save();

        res.status(200).json(event);

      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }
};

const deleteEventPhoto = async (req, res) => {

  try {

    const { id } = req.params;
    const { image } = req.body;

    const event = await Events.findById(id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    event.gallery = event.gallery.filter((img) => img !== image);

    await event.save();

    res.status(200).json(event);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Delete failed" });

  }
};

module.exports = {
  addEventData,
  getEventsData,
  addEventPhoto,
  deleteEventPhoto,
  deleteEventData,
  markEventAsDone,
};

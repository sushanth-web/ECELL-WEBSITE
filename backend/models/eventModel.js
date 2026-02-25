const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  date: { type: String, required: true },
  desc: { type: String, required: true },

  imageUrl: { type: String, required: true }, // card image
  gallery: [{ type: String }], // multiple photos for past events

  type: {
    type: String,
    enum: ["upcoming", "past"],
    default: "upcoming",
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  name: { type: String, required: true },
  desc: { type: String, required: true },
  imageUrl: { type: String, required: true }
},
{ timestamps: true }
);

/* IMPORTANT: MODEL NAME MUST BE "Startup" */
module.exports = mongoose.model("Startup", startupSchema);
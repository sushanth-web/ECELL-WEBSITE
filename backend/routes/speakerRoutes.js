const express = require("express");
const upload = require("../middleware/upload");

const {
  addSpeaker,
  getSpeakers,
  deleteSpeaker
} = require("../controllers/speakerController");

const router = express.Router();

router.post("/", upload.single("image"), addSpeaker);

router.get("/", getSpeakers);

router.delete("/:id", deleteSpeaker);

module.exports = router;
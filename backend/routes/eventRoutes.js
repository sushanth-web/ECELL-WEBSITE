const express = require("express");
const upload = require("../middleware/upload");
const {
  addEventData,
  getEventsData,
  addEventPhoto,
  deleteEventPhoto,
  deleteEventData,
  markEventAsDone,
} = require("../controllers/eventController");

const router = express.Router();

router.post("/", upload.single("image"), addEventData);

router.get("/", getEventsData);

router.delete("/:id", deleteEventData);

router.put("/markdone/:id", markEventAsDone);

/* NEW ROUTES */

router.post("/photo/:id", upload.single("image"), addEventPhoto);

router.delete("/photo/:id", deleteEventPhoto);

module.exports = router;

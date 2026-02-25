const express = require("express");
const upload = require("../middleware/upload");

const {
  addStartup,
  getStartups,
  deleteStartup
} = require("../controllers/startupController");

const router = express.Router();

/* ADD STARTUP */
router.post("/", upload.single("image"), addStartup);

/* GET STARTUPS */
router.get("/", getStartups);

/* DELETE STARTUP */
router.delete("/:id", deleteStartup);

module.exports = router;
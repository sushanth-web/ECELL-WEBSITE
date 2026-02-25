const express = require("express");
const upload = require("../middleware/upload");
const { addMemberData, getTeamData, deleteTeamData } = require("../controllers/teamController");

const router = express.Router();

router.post("/", upload.single("image"), addMemberData);
router.get("/", getTeamData);
router.delete("/:id", deleteTeamData);

module.exports = router;

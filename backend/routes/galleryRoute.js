const express = require("express");
const upload = require("../middleware/upload");
const { addGalleryData, getGalleryData, deleteGalleryData } = require("../controllers/galleryController");

const router = express.Router();

router.post("/", upload.single("image"), addGalleryData);
router.get("/", getGalleryData);
router.delete("/:id", deleteGalleryData);

module.exports = router;

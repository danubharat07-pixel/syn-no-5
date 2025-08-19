const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createMaterial,
  getMaterials,
} = require("../controllers/materialController");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/", upload.single("file"), createMaterial);
router.get("/", getMaterials);

module.exports = router;

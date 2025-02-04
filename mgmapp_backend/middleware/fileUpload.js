const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to the 'uploads/' folder
  },
  filename: (req, file, cb) => {
    const route = req.originalUrl.split('/')[1]; // Get the route name (e.g., "merch", "events")
    const prefix = route || 'default'; // Default prefix if the route is not available
    const type = file.mimetype.split('/')[1]; // Get the file type (e.g., "jpg", "png")
    const uniqueName = `${prefix}_${Date.now()}.${type}`; // Create a unique name
    cb(null, uniqueName); // Save with the new filename
  },
});

const fileUpload = multer({ storage });

module.exports = fileUpload;

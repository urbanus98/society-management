const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to the 'uploads/' folder
  },
  filename: (req, file, cb) => {
    const route = req.originalUrl.split('/')[1]; // Get the route name
    const prefix = route || 'file'; // Default prefix if the route is not available
    const type = path.extname(file.originalname); // Get the file type
    const originalName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, "");
    let uniqueName;

    switch (route) {
      case "merch":
        uniqueName = `${prefix}_${Date.now()}${type}`;
        break;
      case "orders":
        uniqueName = `${originalName}${type}`;
        break;
    }
    cb(null, uniqueName); // Save with the new filename
  },
});

const fileUpload = multer({ storage });

module.exports = fileUpload;

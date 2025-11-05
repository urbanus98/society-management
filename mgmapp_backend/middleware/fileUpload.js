const multer = require('multer');
const path = require('path');
const errorHandler = require('./errorHandler');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to uploads/
  },
  filename: (req, file, cb) => {
    try {
      const route = req.originalUrl.split('/')[2]; // Get route name
      const prefix = route || 'file'; // Default prefix
      const type = path.extname(file.originalname); // Get file type
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

      if (!uniqueName) {
        uniqueName = `${prefix}_${Date.now()}${type}`;
      }

      cb(null, uniqueName); // Save with new filename
    } catch (err) {
      errorHandler(err, null, { status: () => ({ send: () => { } }) }, () => { });
    }
  },
});

const fileUpload = multer({ storage });

module.exports = fileUpload;

const { checkATS } = require('../controllers/atsControllers.js');
const express = require('express');
const router = express.Router();
const multer = require('multer');


// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

router.post('/check-ats', upload.single('resume'), checkATS);

module.exports = router;
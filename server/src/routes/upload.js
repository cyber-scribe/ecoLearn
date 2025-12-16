const express = require('express');
const router = express.Router();
const { cloudinary, upload } = require('../config/cloudinary');
const auth = require('../middleware/auth');
const Submission = require('../models/Submission');

const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(buffer);
  });

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { challengeId, taskId, description } = req.body;
    const userId = req.user.id;

    const isVideo = req.file.mimetype && req.file.mimetype.startsWith('video/');
    const mediaField = isVideo ? 'proofVideo' : 'proofImage';

    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: 'ecolearn',
      resource_type: isVideo ? 'video' : 'image',
    });

    const submission = new Submission({
      userId,
      challengeId: challengeId || undefined,
      [mediaField]: uploadResult.secure_url,
      mediaType: isVideo ? 'video' : 'image',
      publicId: uploadResult.public_id,
      description,
      status: 'pending'
    });

    await submission.save();

    res.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: isVideo ? 'video' : 'image',
      submissionId: submission._id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;

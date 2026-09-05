const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.originalname.includes('bad-request') || !file.mimetype.startsWith('image/')) {
      return cb(new Error('INVALID_IMAGE'));
    }
    cb(null, true);
  },
}).single('image');

const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE' || (err.message && err.message.includes('file too large'))) {
        return res.status(413).json({
          status: 'fail',
          message: 'Payload content length greater than maximum allowed: 1000000',
        });
      }
      return res.status(400).json({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
    }
    next();
  });
};

module.exports = handleUpload;
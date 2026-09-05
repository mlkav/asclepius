const express = require('express');
const handleUpload = require('../middlewares/uploadMiddleware');
const { postPredictHandler, getHistoriesHandler } = require('../controllers/predictController');

const router = express.Router();

router.post('/predict', handleUpload, postPredictHandler);
router.get('/predict/histories', getHistoriesHandler);

module.exports = router;
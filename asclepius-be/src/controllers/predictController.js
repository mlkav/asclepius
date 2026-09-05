const { v4: uuidv4 } = require('uuid');
const { predictClassification } = require('../services/modelService');
const { storePrediction, getPredictionHistories } = require('../services/databaseService');

async function postPredictHandler(req, res) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
    }

    const { result, suggestion } = await predictClassification(req.file.buffer);

    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const dataData = {
      id,
      result,
      suggestion,
      createdAt,
    };

    await storePrediction(dataData);

    return res.status(201).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data: dataData,
    });

  } catch (error) {
    console.error('Prediction Error:', error.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
  }
}

async function getHistoriesHandler(req, res) {
  const histories = await getPredictionHistories();
  return res.status(200).json({
    status: 'success',
    data: histories,
  });
}

module.exports = { postPredictHandler, getHistoriesHandler };
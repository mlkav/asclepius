const tfModule = require('@tensorflow/tfjs-node');
const tf = tfModule.default || tfModule;

const MODEL_URL = process.env.MODEL_URL || 'https://storage.googleapis.com/submissionmlgc-models/model.json';

let model;

async function loadModel() {
//   console.log(`Loading model from: ${MODEL_URL}`);

  const loadGraph = tf.loadGraphModel
    || (tf.default && tf.default.loadGraphModel)
    || tfModule.loadGraphModel;

  if (typeof loadGraph === 'function') {
    model = await loadGraph(MODEL_URL);
  } else {
    throw new Error('Fungsi loadGraphModel tidak ditemukan di paket TensorFlow.js');
  }

  console.log('Model loaded successfully!');
}

async function predictClassification(imageBuffer) {
  const tensor = tfModule.node
    .decodeImage(imageBuffer, 3)
    .resizeNearestNeighbor([224, 224])
    .expandDims(0)
    .toFloat();

  const prediction = model.predict(tensor);
  const scoreData = await prediction.data();
  const score = scoreData[0];

  const isCancer = score > 0.5;
  const result = isCancer ? 'Cancer' : 'Non-cancer';
  const suggestion = isCancer
    ? 'Segera periksa ke dokter!'
    : 'Penyakit kanker tidak terdeteksi.';

  return { result, suggestion };
}

module.exports = { loadModel, predictClassification };
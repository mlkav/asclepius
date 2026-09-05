const express = require('express');
const cors = require('cors');
const { loadModel } = require('./services/modelService');
const predictRoutes = require('./routes/predictRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint Root Status (Health Check)
app.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Backend Service is Healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mounting Router
app.use('/', predictRoutes);

// Error Handling Middleware
app.use(errorHandler);

loadModel().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Express berjalan pada http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to load model:', err);
});
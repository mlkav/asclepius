const errorHandler = (err, req, res, next) => {
  if (err.status === 413 || err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000',
    });
  }
  return res.status(400).json({
    status: 'fail',
    message: 'Terjadi kesalahan dalam melakukan prediksi',
  });
};

module.exports = errorHandler;
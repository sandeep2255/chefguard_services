const errorHandler = (err, req,res, next) => {
  if (!err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
 
};


module.exports = { errorHandler };
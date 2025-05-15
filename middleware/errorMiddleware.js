const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  const errorHandler = (err, req, res, next) => {
    // Set status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.json({
        success: false,
        error: messages
      });
    }
    
    if (err.code === 11000) {
      return res.json({
        success: false,
        error: 'Duplicate field value entered'
      });
    }
    
    if (err.name === 'CastError') {
      return res.json({
        success: false,
        error: 'Resource not found'
      });
    }
    
    res.json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };
  
  export { notFound, errorHandler };
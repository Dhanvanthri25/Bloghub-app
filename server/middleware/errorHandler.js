export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  let customError = {
    statusCode: error.statusCode || 500,
    message: error.message || 'Server Error'
  };

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map(val => val.message).join(', ');
    customError = {
      statusCode: 400,
      message
    };
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    customError = {
      statusCode: 400,
      message: `${field} already exists`
    };
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    customError = {
      statusCode: 404,
      message: 'Resource not found'
    };
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    customError = {
      statusCode: 401,
      message: 'Invalid token'
    };
  }

  if (error.name === 'TokenExpiredError') {
    customError = {
      statusCode: 401,
      message: 'Token expired'
    };
  }

  res.status(customError.statusCode).json({
    success: false,
    message: customError.message
  });
};
export function notFound(req, res) {
  res.status(404).json({ error: { message: 'The requested resource was not found.' } });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    return res.status(409).json({ error: { message: 'An account with this email already exists.' } });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ error: { message: 'The requested identifier is invalid.' } });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: { message: 'The submitted information is invalid.' } });
  }

  console.error(error);
  return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
}
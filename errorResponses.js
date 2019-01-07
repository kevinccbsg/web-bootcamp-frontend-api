module.exports = (errorType, t) => {
  const types = {
    400: { status: 400, error: '400 Bad request' },
    404: { status: 404, error: '404 Not found' },
    500: { status: 500, error: '500 Internal server error' },
  };
  return types[errorType || '500'] || types['500'];
};

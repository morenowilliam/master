const response = (res, statusCode, message, data = null) => {
  let status = 'success';
  if (statusCode >= 500) {
    status = 'error';
  } else if (statusCode >= 400) {
    status = 'fail';
  }

  const payload = {
    status,
  };

  if (message && message !== 'success') {
    payload.message = message;
  }

  if (data !== null && data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

export default response;

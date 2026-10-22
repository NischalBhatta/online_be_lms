export const responseClient = ({ req, res, message, statusCode = 200 }) => {
  //Success Response
  req.success = () => {
    return res.status(statusCode).json({
      status: "success",
      message,
    });
  };
  //Error Response
  req.error = () => {
    return res.status(statusCode).json({
      status: "error",
      message,
    });
  };

  if (statusCode >= 200 && statusCode < 300) {
    return req.success();
  } else {
    return req.error();
  }
};

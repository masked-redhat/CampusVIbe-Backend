const serveResWSC = (res, statusCode, message, args = {}) => {
  let responseLog;
  try {
    responseLog =
      `Response Served with Status Code "${statusCode}" and Message "${message}"` +
      "\nOther data sent";

    res.status(statusCode).json({ message, ...args });

    console.log(responseLog, args);
    return true;
  } catch (err) {
    console.log(err);

    responseLog = "Error occured while sending response";
    return false;
  }
};

const responses = {
  serve: serveResWSC,
};

export default responses;

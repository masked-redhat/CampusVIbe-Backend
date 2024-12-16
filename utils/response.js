const serveResWSC = (res, statusCode, message, args = {}) => {
  try {
    res.status(statusCode).json({ message, ...args });
    console.log(
      `Response Served with Status Code "${statusCode}" and Message "${message}"`,
      "\nOther data sent",
      args
    );
  } catch (err) {
    console.log(err);
    console.log("Error occured while sending response");
  }
};

const responses = {
  serve: serveResWSC,
};

export default responses;

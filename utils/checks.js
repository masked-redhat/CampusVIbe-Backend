const isNull = (entity) => {
  return entity === null;
};

const isTrue = (entity, trueCondition = true) => {
  return entity === trueCondition;
};

const isNotNuldefined = (entity) => {
  return entity != null && entity != undefined;
};

const isErrorCode = (err, code = 1062) => {
  let errno;
  try {
    errno = err.errno ?? err.original.errno ?? err.parent.errno;
  } catch (err) {
    console.log(err);
    errno = null;
  }
  return errno === code;
};

const checks = {
  isNull,
  isTrue,
  isNotNuldefined,
  isErrorCode,
};

export default checks;

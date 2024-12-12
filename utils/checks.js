const isNull = (entity) => {
  return entity === null;
};

const isTrue = (entity) => {
  return entity === true;
};

const isNotNuldefined = (entity) => {
  return entity != null && entity != undefined;
};

const checks = {
  isNull,
  isTrue,
  isNotNuldefined,
};

export default checks;

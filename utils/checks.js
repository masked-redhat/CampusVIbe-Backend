const isNull = (entity) => {
  return entity === null;
};

const isTrue = (entity, trueCondition = true) => {
  return entity === trueCondition;
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

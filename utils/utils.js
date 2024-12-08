export const isNumeric = (value) => {
  return /^-?\d+$/.test(value);
};

export const covertToSeconds = (timestamp) => {
  const date = new Date(timestamp);
  const seconds = Math.floor(date.getTime() / 1000);
  return seconds;
};

export const isEmpty = (entity = []) => {
  return entity.length === 0;
};

export const affected = (entity) => {
  return entity.affectedRows !== 0;
};

export const affectedOne = (entity) => {
  return entity.affectedRows === 1;
};

export const runMultipleFunctions = (
  functions = [],
  values = [],
  throwErrorAt = false
) => {
  let functionParams = 0;
  functions.forEach((func) => (functionParams += func.length));

  if (functionParams !== values.length)
    throw new Error("Invalid number of parameters given to functions");

  let valuesDone = 0;
  functions.forEach((func) => {
    let res = func(...values.slice(valuesDone, valuesDone + func.length));
    if (res === throwErrorAt)
      throw new Error("Invalid result to continue operations");
    valuesDone += func.length;
  });
};

export const runMultipleFunctionsAsync = async (
  functions = [],
  values = [],
  throwErrorAt = false
) => {
  let functionParams = 0;
  functions.forEach((func) => (functionParams += func.length));

  if (functionParams !== values.length)
    return new Error("Invalid number of parameters given to functions");

  let valuesDone = 0;
  functions.forEach(async (func) => {
    let res = await func(...values.slice(valuesDone, valuesDone + func.length));
    if (res === throwErrorAt)
      return new Error("Invalid result to continue operations");
    valuesDone += func.length;
  });
};

export const getMinMax = (...args) => {
  let minVal = args[0],
    maxVal = args[0];

  args.forEach((arg) => {
    minVal = Math.min(minVal, arg);
    maxVal = Math.max(maxVal, arg);
  });

  return { minVal, maxVal };
};

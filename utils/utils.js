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

const functionParameters = (func) => {
  let params = func.toString().match(/\([\s\S]*?\)/)[0];
  params = params.replace(/=[\s\S]*[\)\,]/, "").replace("(", "");
  params = params.split(",");

  return params;
};

export const runMultipleFunctionsAsync = async (
  functions = [],
  values = [],
  throwErrorAt = false
) => {
  let functionParams = 0;
  functions.forEach(
    (func) => (functionParams += functionParameters(func).length)
  );

  if (functionParams !== values.length) return false;

  let valuesDone = 0;

  for (let i = 0; i < functions.length; i++) {
    const func = functions[i];
    const params = functionParameters(func).length;

    let res = await func(...values.slice(valuesDone, valuesDone + params));
    if (res === throwErrorAt) return false;
    valuesDone += params;
  }

  return true;
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

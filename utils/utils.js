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
  return entity.affectedRows !== 0 || entity.changedRows !== 0;
};

export const affectedOne = (entity) => {
  return entity.affectedRows === 1 || entity.changedRows === 1;
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

export const capitalize = (string) => {
  return string[0].toUpperCase() + string.substring(1);
};

export const prepareQuerySelectValNotNull = (
  params = [],
  values = [],
  command = "set",
  force = false
) => {
  let queryAddition = [];
  let validVals = [];
  for (let i = 0; i < params.length; i++) {
    if (values[i] !== null) {
      queryAddition.push(`${params[i]}=?`);
      validVals.push(values[i]);
    }
  }
  queryAddition = queryAddition.join(", ");
  queryAddition = queryAddition || force ? command + " " + queryAddition : "";
  return { queryAddition, values: validVals };
};

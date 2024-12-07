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

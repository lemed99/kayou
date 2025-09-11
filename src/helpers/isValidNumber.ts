const isValidNumber = (val: number | string, nullable = false, allowNegative = false) => {
  val = val.toString();
  if (!val) return false;
  const toFloat = parseFloat(val);
  if (isNaN(toFloat)) return false;
  if (toFloat === 0 && nullable) return true;
  if (allowNegative) return true;
  return toFloat > 0;
};

export default isValidNumber;

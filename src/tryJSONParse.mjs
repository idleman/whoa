export default function tryJSONParse(val, ...args) {
  let result = val;
  try {
    result = JSON.parse(val, ...args);
  } catch(err) { }
  return result;
};
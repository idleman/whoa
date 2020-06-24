import isObjectLiteral from './isObjectLiteral.mjs';


export default function sortObjectLiteral(obj) {
  if(!isObjectLiteral(obj)) {
    return obj;
  }
  const clone = {};
  Object.keys(obj)
    .sort()
    .forEach(key => (clone[key] = sortObjectLiteral(obj[key])));

  return clone;
};
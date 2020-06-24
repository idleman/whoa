export default function isObjectLiteral(obj) {
  return !!(obj && (Object.getPrototypeOf(obj) === Object.prototype));
};
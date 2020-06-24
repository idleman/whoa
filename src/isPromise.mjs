export default function isPromise(cb) {
  return !!(cb && typeof cb.then === 'function');
};
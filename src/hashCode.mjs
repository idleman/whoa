export default function hashCode(str, hash = 0) {
  const length = str.length;
  for (let i = 0; i < length; ++i) {
    const val = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+val;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash < 0 ? (-hash) : hash;
};
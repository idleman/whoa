
function getAsNumber(value) {
  
  if(!value) {
    return 0;
  }
  const asInt = (value|0);
  if(!asInt) {
    return 0;
  }
  // so we allow left padding (01, 02, 03, ...)
  const asString = asInt.toString();
  const result = (asString === value) || (('0' + asString) === value); 
  return result ? asInt : 0;
}

export default function getMigrationFolderNameInfo(name) {
  // 2020-06-23-01
  if(name.length !== 13) {
    return null;
  }
  
  const parts = name.split('-')
    .map(val => getAsNumber(val))
    .filter(val => !!val);
    
  if(parts.length !== 4) {
    return null;
  }
  
  const [year, month, day, version] = parts;
  const result = (2000 < year && year < 2100) &&
                (1 <= month && month <= 12) && 
                (1 <= day && day <= 31);
  
  return result ? ({ year, month, day, version }) : null;
};
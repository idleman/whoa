import path from 'path';
import fs from 'fs-extra';

export default function getMigrationFilesInfo(data, dir) {
  if(!data) {
    return [];
  }
  
  if(typeof data === 'string') {
    return getMigrationFiles([data], dir);
  }
  
  return Promise.all(data.map(async p => {
    const arr = Array.isArray(p) ? p : [p, ''];
    const [src, opt = ''] = arr;
    const options = typeof opt !== 'string' ? opt : { title: opt };
    const filename = path.resolve(`${dir}/${src}`);
    const source = await fs.readFile(filename, 'utf8');
    return {
      ...options,
      source,
      filename
    };
  }));
}
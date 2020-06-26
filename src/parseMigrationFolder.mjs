
import fs from 'fs-extra';
import hashCode from './hashCode.mjs';
import getMigrationFilesInfo from './getMigrationFilesInfo.mjs';
import getMigrationFolderNameInfo from './getMigrationFolderNameInfo.mjs';


function validateMigrationHeader(migration, got) {
  const revision = migration.revision;
  const id = migration.id;
  const expected = {
    id,
    year:  revision.getFullYear(),
    month:  revision.getUTCMonth() + 1,
    day: revision.getUTCDate(),
    version: migration.version
  };


  Object.entries(expected)
    .forEach(([key, value]) => {
      if(got[key] !== value) {
        throw new Error(`Migration (${id}): Incorrect value for ("${key}"). Expected (value="${value}"), but got (value="${got[key]}"),`);
      }
    });
  
}


const getFileInfoSourceHash = (hash, item) => hashCode(item.source, hash); //arr.reduce(getFileInfoSourceHashHelper, hash);
const getPrimaryHashCodeHelper = (hash, arr) => arr.reduce(getFileInfoSourceHash, hash);
const getPrimaryHashCode = (primary, hash = 0) => primary.reduce(getPrimaryHashCodeHelper, hash); // [ [ { source } ] ]
const getSecondaryHashCodeHelper = (hash, obj) => obj.info.reduce(getFileInfoSourceHash, hash);
const getSecondaryHashCode = (secondary, hash = 0) => secondary.reduce(getSecondaryHashCodeHelper, hash); // [ { info: [ { source } ] ]

function toDateString(info) {
  return [
   info.year,
   info.month.toString().padStart(2, '0'),
   info.day.toString().padStart(2, '0')
  ].join('-');
}
export default async function parseMigrationFolder(dir, { id, name, history }) { 
  const migration = history[id - 1];
  const info = getMigrationFolderNameInfo(name);
  if(migration) {
    validateMigrationHeader(migration, { id, ...info });
  }

  const config = await fs.readJson(`${dir}/config.json`);
  const _primary = ['main', 'after', 'before']
    .map(type => getMigrationFilesInfo(config[type], dir));

  const configEnv = config.env || {};
  const _secondary = Object.keys(configEnv)
    .sort()
    .map(async name => ({ name, info: await getMigrationFilesInfo(configEnv[name], dir) }));

  
  const [primary, secondary] = await Promise.all([
    Promise.all(_primary),
    Promise.all(_secondary)
  ]);
  
  const hash = getPrimaryHashCode(primary, getSecondaryHashCode(secondary));
  if(migration) {
    if(hash !== migration.hash) {
      throw new Error(`Migration (${ID}): Hash mismatch. Expected (hash=${migration.hash}), but got (hash=${hash})`);
    }
    return null;
  }
  
  const env = secondary.find(item => item.name === process.env.NODE_ENV) || [];
  const [main, after, before] = primary;
  
  return {
    main,
    after,
    before,
    env,
    stats: {
      id,
      hash,
      revision: toDateString(info),
      version: info.version.toString().padStart(2, '0'),
    }
  };
};
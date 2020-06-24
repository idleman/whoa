
import fs from 'fs-extra';
import parseMigrationFolder from './parseMigrationFolder.mjs';
import isMigrationFolderName from './isMigrationFolderName.mjs';

export default async function parseMigrationsFolder(dir, options) {   
  const _folders = await fs.readdir(dir);

  const folders = _folders
    .filter(name => isMigrationFolderName(name))
    .sort();

  const { history } = options;
  
  if(folders.length < history.length) {
    throw new Error(`Update rejected. This version is not the latest. Please fetch the latest migration files.`);
  }

  if(folders.length === history.length) {
    return [];
  }
  
  const possibleMigrations = await Promise.all(folders.map(async (name, index) => {
    const config = await parseMigrationFolder(`${dir}/${name}`, { ...options, name, id: index+1 });
    if(!config) {
      return config;
    }
    return {
      name,
      config
    };
  }));
  return possibleMigrations
    .filter(obj => !!obj);
};
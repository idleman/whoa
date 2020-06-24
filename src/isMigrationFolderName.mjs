import getMigrationFolderNameInfo from './getMigrationFolderNameInfo.mjs';


export default function isMigrationFolderName(name) {
  return !!getMigrationFolderNameInfo(name);
};
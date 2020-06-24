#!/usr/bin/env node --experimental-modules
import applyMigrations from '../src/applyMigrations.mjs';
import setupMigrationTable from '../src/setupMigrationTable.mjs';
import parseProcessArguments from '../src/parseProcessArguments.mjs';
import parseMigrationsFolder from '../src/parseMigrationsFolder.mjs';
import getDatabaseConnection from '../src/getDatabaseConnection.mjs';
import getCurrentRevisionHistory from '../src/getCurrentRevisionHistory.mjs';

async function main(directory, options) {
  const migrations = await parseMigrationsFolder(directory, options);
  return applyMigrations(migrations, options);
}


(async () => {
  const { params, values } = parseProcessArguments(process.argv.slice(2), {
    host: process.env.HOST,
    user: process.env.USER,
    driver: process.env.DRIVER || 'mysql',
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
  });
  const directory = values[0];
  if(!directory) {
    console.log('No migration folder specified');
    return process.exit(0);
  }

  const connection = await getDatabaseConnection(params);
  
  try {
    await setupMigrationTable(connection);
    const history = await getCurrentRevisionHistory(connection);
    await main(directory, { ...params, history, connection });
  } catch(err) {
    console.error(err);
    process.exit(1);
  } finally {
    connection.end();
  }
})();
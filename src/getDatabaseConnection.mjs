import mysql from 'mysql2/promise.js';

const supported_drivers = ['mysql'];

export default async function getDatabaseConnection({ host, user, password, database, driver }) {
  if(driver !== 'mysql') {
    throw new Error(`Unsupported driver ("${driver}"). Supported drivers: ${supported_drivers.join(', ')}`);
  }

  if(!(host && user && password && database)) {
    throw new Error(`Invalid database credentials.`);
  }
  const multipleStatements = true;
  const connection = await mysql.createConnection({ host, user, password, database, multipleStatements });
  // we create a wrapper here, so we can easily add more drivers/db(s) later with one shared interface
  return {
    async execute(sql, ...args) {
      const commands = sql.split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => !!cmd);

      if(commands.length <= 1) {
        await connection.execute(sql, ...args);
        return true;
      }

      for(const cmd of commands) {
        await connection.execute(cmd);
      }
      
      return true;
    },
    
    async query(sql) {
      const [rows] = await connection.query(sql);
      return rows.map(row => {
        const { id, hash, version, revision } = row;
        return {
          id,
          hash,
          version,
          revision
        };
      });
    },

    end() {
      return connection.end();
    }
  }
}

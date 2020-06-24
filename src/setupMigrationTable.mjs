const trim = sql => sql.split('\n').map(n => n.trim()).join('\n');
const setupSQL = trim(`
  CREATE TABLE IF NOT EXISTS whoa (
    id int unsigned NOT NULL AUTO_INCREMENT,
    hash int unsigned NOT NULL,
    revision DATE NOT NULL,
    version int unsigned NOT NULL,
    PRIMARY KEY(ID)
  );
`);

export default async function setupMigrationTable(connection) {
  await connection.execute(setupSQL);
};
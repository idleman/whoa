export default function getCurrentRevisionHistory(connection) {
  return connection.query('SELECT * FROM whoa ORDER BY ID ASC');
};
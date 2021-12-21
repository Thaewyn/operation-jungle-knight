const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
	password: '', //FIXME: use .env data or process string not demo junk.
	database: 'jungleknight'
});

module.exports = conn;
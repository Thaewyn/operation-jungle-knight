const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
	password: process.env.MYSQL_PASS,
	database: 'jungleknight'
});

module.exports = conn;
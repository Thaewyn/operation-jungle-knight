const express = require("express");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
// const db = require('./db');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new MySQLStore({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'jungleknight'
});
app.use(session({
	key: 'jungle_cookie',
	secret: 'there_once_was_a_man_from_nantucket',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

// routes
require("./routes/api_routes.js")(app);
require("./routes/view_routes.js")(app);

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});

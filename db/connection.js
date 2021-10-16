const mysql = require("mysql2");
require("dotenv").config();
// connection to mysql database

const db = mysql.createConnection({
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

module.exports = db;
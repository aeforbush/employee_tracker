const mysql = require("mysql2");
require("dotenv").config();
// connection to mysql database

const connection = mysql.createConnection(
  {
    host: "localhost",
    // mysql username
    user: "root",
    // mysql password
    password: "SRMa204@?ZC",
    database: "employee",
  });

module.exports = connection;
const express = require("express");
const db = require("./db/connection");
const inquirer = require("inquirer");
// const cTable = require('console.table');
const PORT = process.env.PORT || 3002;
const app = express();

// start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database conected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

const express = require("express");
const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// once connection is established Employee Manager shows
openingMessage = () => {
  console.log("**********************");
  console.log("*                    *");
  console.log("*  Employee Manager  *");
  console.log("*                    *");
  console.log("**********************");
  promptUser();
};

// initial questions for first action
const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Update a manager role",
          "View employee by manager",
          "View employee by department",
          "Remove a department",
          "Remove a role",
          "Remove an employee",
          "View department budgets",
          "No action",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View all departments") {
        showDepartments();
      }
      if (choices === "View all roles") {
        showRoles();
      }
      if (choices === "View all employees") {
        showEmployees();
      }
      if (choices === "Add a department") {
        addDepartment();
      }
      if (choices === "Add a role") {
        addRole();
      }
      if (choices === "Add an employee") {
        addEmployee();
      }
      if (choices === "Update an employee role") {
        updateEmployee();
      }
      if (choices === "Update a manager role") {
        updateManager();
      }
      if (choices === "View employee by department") {
        showEmployeeDept();
      }
      if (choices === "Remove a department") {
        removeDepartment();
      }
      if (choices === "Remove a role") {
        removeRole();
      }
      if (choices === "Remove an employee") {
        removeEmployee();
      }
      if (choices === "View department budgets") {
        viewBudget();
      }
      if (choices === "No Action") {
        connection.end();
      }
    });
};

// shows all departments
showDepartments = () => {
  console.log("showing all departments");
  const sql = `SELECT department.id AS id, department.dept_name AS department FROM department`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    promptUser();
  });
};

// shows all roles 
showRoles = () => {
    console.log('Showing all roles');
    const sql = `Select employee_role.roles As roles, `
}


// shows all employees
showEmployees = () => {
  console.log("Showing all employees");
  const sql = `SELECT employee.id,
    employee.first_name,
    employee.last_name,
    employee_role.title,
    department.dept_name AS department,
    employee_role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role_id
    LEFT JOIN department ON employee_role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    promptUser;
  });
};




// start server after DB connection
connection.connect((err) => {
  if (err) throw err;
  console.log("Database conected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

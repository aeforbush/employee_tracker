const express = require("express");
const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// once connection is established Employee Manager shows
const openingMessage = () => {
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
        //   "Update a manager role",
        //   "View employee by manager",
        //   "View employee by department",
        //   "Remove a department",
        //   "Remove a role",
        //   "Remove an employee",
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
    //   if (choices === "Update a manager role") {
    //     updateManager();
    //   }
    //   if (choices === "View employee by department") {
    //     showEmployeeDept();
    //   }
    //   if (choices === "Remove a department") {
    //     removeDepartment();
    //   }
    //   if (choices === "Remove a role") {
    //     removeRole();
    //   }
    //   if (choices === "Remove an employee") {
    //     removeEmployee();
    //   }
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
  console.log("Showing all departments");
  const sql = `SELECT department.id AS id, department.dept_name AS department FROM department`;

  connection
    .promise()
    .query(sql)
    .then((rows) => {
      console.log(rows[0]);
      promptUser();
    })
    .catch((err) => {
      console.log(err);
    });
};

// shows all roles
showRoles = () => {
  console.log("Showing all roles");
  const sql = `Select employee_role.id, employee_role.title, department.dept_name AS department
                FROM employee_role
                INNER JOIN department ON employee_role.department_id = department.id`;
  connection
    .promise()
    .query(sql)
    .then((rows) => {
      console.log(rows[0]);
      promptUser();
    })
    .catch((err) => {
      console.log(err);
    });
};

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
    LEFT JOIN employee_role ON employee.role_id = employee_role.id
    LEFT JOIN department ON employee_role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection
    .promise()
    .query(sql)
    .then((rows) => {
      console.log(rows[0]);
      promptUser();
    })
    .catch((err) => {
      console.log(err);
    });
};

// add a department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Please add department name.",
      },
    ])
    .then(({ name }) => {
      const sql = `INSERT INTO department (dept_name)
      VALUES (?)`;
      connection.query(sql, name, (err, result) => {
        if (err) throw err;
        console.log("Added " + name + " to departments.");
        console.table(result);

        showDepartments();
      });
    });
};

// add a role
const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role would you like to add?",
        validate: (addRole) => {
          if (addRole) {
            return true;
          } else {
            console.log("Please enter a role.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "what is the salary of this role?",
        validate: (addSalary) => {
          if (addSalary) {
            return true;
          } else {
            console.log("Please enter a salary");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.role, answer.salary];
      const roleSql = `SELECT dept_name AS name, id AS value FROM department`;

      connection
        .promise()
        .query(roleSql)
        .then((data) => {
          console.log(data[0]);
          inquirer
            .prompt([
              {
                type: "list",
                name: "department",
                message: "What department is this role in?",
                choices: data[0],
              },
            ])
            .then((deptChoice) => {
              const department = deptChoice.department;
              params.push(department);

              const sql = `INSERT INTO employee_role (title, salary, department_id) 
                  VALUES(?,?,?)`;

              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log("Added" + answer.role + " to roles.");
                console.table(result);

                showRoles();
              });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

// add an employee

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter employee's first name",
        validate: (addFirst) => {
          if (addFirst) {
            return true;
          } else {
            console.log("Please enter the employee's first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter employee's last name.",
        validate: (addLast) => {
          if (addLast) {
            return true;
          } else {
            console.log("Please enter the employee's last name.");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.firstName, answer.lastName];

      // get roles from roles table
      const roleSql = `SELECT employee_role.id, employee_role.title AS title FROM employee_role`;

      connection
        .promise()
        .query(roleSql)
        .then((data) => {
          console.log(data);

          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "Enter the employee's role.",
                choices: data[0],
              },
            ])
            .then((roleChoices) => {
              const role = roleChoices.role;
              params.push(role);

              const managerSql = `SELECT * FROM employee`;

              connection
                .promise()
                .query(managerSql)
                .then((data) => {
                  console.log(data);

                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: data[0],
                      },
                    ])
                    .then((managerChoice) => {
                      const manager = managerChoice.manager;
                      params.push(manager);

                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?,?,?,?)`;

                      connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been added.");
                        console.table(result);

                        showEmployees();
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            });
        });
    });
};

// update an employee
const updateEmployee = () => {
  const employeeSql = `SELECT * FROM employee`;

  connection
    .promise()
    .query(employeeSql)
    .then((data) => {
      console.log(data);

      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: data[0],
          },
        ])
        .then((employChoice) => {
          const employee = employChoice.name;
          const params = [];
          params.push(employee);

          const roleSql = `SELECT * FROM employee_role`;

          connection
            .promise()
            .query(roleSql)
            .then((data) => {
              console.log(data);
            })
            .catch((err) => {
              console.log(err);
            });

          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's new role?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const role = roleChoice.role;
              params.push(role);

              let employee = params[0];
              params[0] = role;
              params[1] = employee;

              console.log(params);

              const sql = `UPDATE employee SET role_id = ? WHERE id =?`;

              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log("Employee has been updated.");
                console.table(result);

                showEmployees();
              });
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

// // update an employee (manager)

// const updateManager = () => {
//   const employeeSql = `SELECT * FROM employee`;

//   connection
//     .promise()
//     .query(employeeSql)
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   const employees = data.map(({ id, first_name, last_name }) => ({
//     name: first_name + " " + last_name,
//     value: id,
//   }));

//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "name",
//         message: "Which employee would you like to update?",
//         choices: employees,
//       },
//     ])
//     .then((employChoice) => {
//       const employee = employChoice.name;
//       const params = [];
//       params.push(employee);

//       const managerSql = `SELECT * FROM employee`;

//       connection
//         .promise()
//         .query(managerSql)
//         .then((data) => {
//           console.log(data);
//         })
//         .catch((err) => {
//           console.log(err);
//         });

//       const managers = data.map(({ id, first_name, last_name }) => ({
//         name: first_name + " " + last_name,
//         value: id,
//       }));

//       inquirer
//         .prompt([
//           {
//             type: "list",
//             name: "manager",
//             message: "Who is the employee's manager?",
//             choices: managers,
//           },
//         ])
//         .then((managerChoice) => {
//           const manager = managerChoice.manager;
//           params.push(manager);

//           let employee = params[0];
//           params[0] = manager;
//           params[1] = employee;

//           console.log(params);

//           const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

//           connection.query(sql, params, (err, result) => {
//             if (err) throw err;
//             console.log("Employee has been updated.");
//             console.table(result);

//             showEmployees();
//           });
//         });
//     });
// };

// // view employee by department

// showEmployeeDept = () => {
//   console.log("Showing employee by departments");
//   const sql = `SELECT employee.first_name,
//     employee.last_name,
//     department.dept_name AS department
//     FROM employee
//     LEFT JOIN role ON employee_id = role.id
//     LEFT JOIN department ON employee_role.department_id = department.id`;

//   connection
//     .promise()
//     .query(sql)
//     .then((rows) => {
//       console.log(rows[0]);
//       promptUser();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// // remove a department
// removeDepartment = () => {
//   const deptSql = `SELECT * FROM department`;

//   connection
//     .promise()
//     .query(deptSql)
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   const dept = data.map(({ name, id }) => ({ name: name, value: id }));

//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "dept",
//         message: "What department do you want to delete?",
//         choices: dept,
//       },
//     ])
//     .then((deptChoice) => {
//       const dept = deptChoice.dept;
//       const sql = `DELETE FROM department WHERE id = ?`;

//       connection.query(sql, dept, (err, result) => {
//         if (err) throw err;
//         console.log("Successfully removed.");
//         console.table(result);

//         showDepartments();
//       });
//     });
// };

// // remove employee_role
// removeRole = () => {
//   const roleSql = `SELECT * FROM employee_role`;

//   connection
//     .promise()
//     .query(roleSql)
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   const employRole = data.map(({ title, id }) => ({
//     name: title,
//     value: id,
//   }));

//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "role",
//         message: "What role would you like to remove?",
//         choices: employRole,
//       },
//     ])
//     .then((employRoleChoice) => {
//       const employRole = employRoleChoice.role;
//       const sql = `DELETE FROM employee_role WHERE id ?`;

//       connection.query(sql, employRole, (err, result) => {
//         if (err) throw err;
//         console.log("Successfully removed.");
//         console.table(result);

//         showRoles();
//       });
//     });
// };

// // remove employees

// removeEmployee = () => {
//   const employeeSql = `SELECT * FROM employee`;

//   connection
//     .promise()
//     .query(employeeSql)
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   const employees = data.map(({ id, first_name, last_name }) => ({
//     name: first_name + " " + last_name,
//     value: id,
//   }));

//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "name",
//         message: "Which employee would you like to remove?",
//         choices: employees,
//       },
//     ])
//     .then((employChoice) => {
//       const employee = employChoice.name;

//       const sql = `DELETE FROM employee WHERE id ?`;

//       connection.query(sql, employee, (err, result) => {
//         if (err) throw err;
//         console.log("Successfully removed.");
//         console.table(result);

//         showEmployees();
//       });
//     });
// };

// view department budget

viewBudget = () => {
  console.log("Showing budget by department.");

  const sql = `SELECT department_id AS id,
    department.dept_name AS department,
    SUM(salary) AS budget
    FROM employee_role
    JOIN department ON employee_role.department_id = department.id GROUP BY department_id`;

  connection
    .promise()
    .query(sql)
    .then((rows) => {
      console.log(rows[0]);
      promptUser();
    })
    .catch((err) => {
      console.log(err);
    });
};

openingMessage();
// start server after DB connection
connection.connect((err) => {
  if (err) throw err;
  console.log("Database conected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

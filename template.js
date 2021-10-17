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
          message: "What is the salary of this role?",
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
        .catch(err => {
            console.log(err);
        })
        });
      };
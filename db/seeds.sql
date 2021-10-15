INTEGER INTO department (id, name) 
VALUES
(1, 'IT'),
(2, 'Marketing'),
(3, 'Accounting'),
(4, 'Operations');

INSERT INTO employee_role (id, title, salary, department_id)
VALUES
(1, 'Full Stack Developer', 80000, 1),
(2, 'Database Architect', 125000, 1),
(3, 'Software Engineer', 90000, 1),
(4, 'Sales Lead', 85000, 2),
(5, 'Marketing Analyst', 80000, 2),
(6, 'Accountant', 75000, 3),
(7, 'Project Manager', 100000, 4),
(8, 'Operations Director', 130000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
(1, 'Ada', 'Lovelace', 1, 1),
(2, 'Ida', 'Tarbell', 2, 1),
(3, 'Elanor', 'Roosevelt', 4, 1),
(4, 'Jane', 'Goodall', 2, 0),
(5, 'Georgia', 'OKeefe', 2, 0),
(6, 'Rachel', 'Carson', 4, 1),
(7, 'Marie', 'Curie', 3, 0),
(8, 'Elizabeth', 'Cady Stanton', 1, 0),
(9, 'Grace', 'Hopper', 1, 1);

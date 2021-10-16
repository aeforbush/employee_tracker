INSERT INTO department (dept_name) 
VALUES
('IT'),
('Marketing'),
('Accounting'),
('Operations');

INSERT INTO employee_role (title, salary, department_id)
VALUES
('Full Stack Developer', 80000, 1),
('Database Architect', 125000, 1),
('Software Engineer', 90000, 1),
('Sales Lead', 85000, 2),
('Marketing Analyst', 80000, 2),
('Accountant', 75000, 3),
('Project Manager', 100000, 4),
('Operations Director', 130000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
( 'Ada', 'Lovelace', 1, 1),
( 'Ida', 'Tarbell', 2, 1),
( 'Elanor', 'Roosevelt', 4, 1),
( 'Jane', 'Goodall', 2, NULL),
( 'Georgia', 'OKeefe', 2, NULL),
( 'Rachel', 'Carson', 4, 1),
( 'Marie', 'Curie', 3, NULL),
( 'Elizabeth', 'Cady Stanton', 1, NULL),
( 'Grace', 'Hopper', 1, 1);

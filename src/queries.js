// Import the database client from the 'db' module
const client = require('./db');

// Function to get all departments from the database
const getDepartments = async () => {
    const res = await client.query('SELECT * FROM department');
    return res.rows;
};

// Function to get all roles from the database
const getRoles = async () => {
    const res = await client.query(`SELECT role.id, role.title, department.name AS department, role.salary 
                                    FROM role 
                                    JOIN department ON role.department_id = department.id`);
    return res.rows;
};

// Function to get all employees from the database
const getEmployees = async () => {
    const res = await client.query(`SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
                                    CONCAT(m.first_name, ' ', m.last_name) AS manager
                                    FROM employee e
                                    JOIN role ON e.role_id = role.id
                                    JOIN department ON role.department_id = department.id
                                    LEFT JOIN employee m ON e.manager_id = m.id`);
    return res.rows;
};

// Function to update employee's manager
const updateEmployeeManager = async (employeeId, managerId) => {
    const res = await client.query(
        'UPDATE employee SET manager_id = $1 WHERE id = $2',
        [managerId, employeeId]
    );
    return res;
};

// Function to get employees by manager
const getEmployeesByManager = async (managerId) => {
    const res = await client.query(
        `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary
         FROM employee e
         JOIN role ON e.role_id = role.id
         JOIN department ON role.department_id = department.id
         WHERE e.manager_id = $1`,
        [managerId]
    );
    return res.rows;
};

// Function to get employees by department
const getEmployeesByDepartment = async (departmentId) => {
    const res = await client.query(
        `SELECT e.id, e.first_name, e.last_name, role.title, role.salary 
         FROM employee e
         JOIN role ON e.role_id = role.id
         WHERE role.department_id = $1`,
        [departmentId]
    );
    return res.rows;
};


// Function to get the total utilized budget of a department
const getTotalBudgetByDepartment = async (departmentId) => {
    const res = await client.query(
        `SELECT SUM(role.salary) AS total_budget
         FROM employee
         JOIN role ON employee.role_id = role.id
         WHERE role.department_id = $1`,
        [departmentId]
    );
    return res.rows[0].total_budget;
};

// Function to add a new department
const addDepartment = async (name) => {
    const res = await client.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [name]);
    return res.rows[0];
};

// Function to add a new role
const addRole = async (title, salary, departmentId) => {
    const res = await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', 
                                   [title, salary, departmentId]);
    return res.rows[0];
};

// Function to add a new employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
    const res = await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', 
                                   [firstName, lastName, roleId, managerId]);
    return res.rows[0];
};

// Function to delete a department
const deleteDepartment = async (departmentId) => {
    const res = await client.query('DELETE FROM department WHERE id = $1 RETURNING *', [departmentId]);
    return res.rows[0];
};

// Function to delete a role
const deleteRole = async (roleId) => {
    const res = await client.query('DELETE FROM role WHERE id = $1 RETURNING *', [roleId]);
    return res.rows[0];
};

// Function to delete an employee
const deleteEmployee = async (employeeId) => {
    const res = await client.query('DELETE FROM employee WHERE id = $1 RETURNING *', [employeeId]);
    return res.rows[0];
};

// Function to update employee's role
const updateEmployeeRole = async (employeeId, roleId) => {
    const res = await client.query(
        'UPDATE employee SET role_id = $1 WHERE id = $2',
        [roleId, employeeId]
    );
    return res;
};

// Export functions for querying departments, roles, employees, updating manager, viewing by manager/department, and deleting
module.exports = { 
    getDepartments, 
    getRoles, 
    getEmployees, 
    updateEmployeeManager, 
    getEmployeesByManager, 
    getEmployeesByDepartment, 
    getTotalBudgetByDepartment, 
    addDepartment, 
    addRole, 
    addEmployee, 
    deleteDepartment, 
    deleteRole, 
    deleteEmployee,
    updateEmployeeRole
};


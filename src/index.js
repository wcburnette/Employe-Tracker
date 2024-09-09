// Import required modules
const inquirer = require('inquirer'); // Import inquirer for prompting user input
const { 
    getDepartments, 
    getRoles, 
    getEmployees, 
    addDepartment, 
    addRole, 
    addEmployee, 
    updateEmployeeRole, 
    updateEmployeeManager, 
    getEmployeesByManager, 
    getEmployeesByDepartment, 
    deleteDepartment, 
    deleteRole, 
    deleteEmployee 
} = require('./queries'); // Import functions from queries.js

const mainMenu = async () => {
    // Prompt the user with a list of choices and wait for their selection
    const { choice } = await inquirer.prompt({
        type: 'list', // Prompt type for a list of options
        name: 'choice', // The key name for the user’s selection
        message: 'What would you like to do?', // Question to display to the user
        choices: [ // List of options for the user to choose from
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Update employee manager',
            'View employees by manager',
            'View employees by department',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'Exit'
        ]
    });

    // Handle the user’s choice with a switch statement
    switch (choice) {
        case 'View all departments':
            console.table(await getDepartments());
            break;
        case 'View all roles':
            console.table(await getRoles());
            break;
        case 'View all employees':
            console.table(await getEmployees());
            break;

        // Add a new department
        case 'Add a department':
            const { departmentName } = await inquirer.prompt({
                type: 'input',
                name: 'departmentName',
                message: 'Enter the department name:'
            });
            await addDepartment(departmentName);
            console.log(`Department ${departmentName} added.`);
            break;

        // Add a new role
        case 'Add a role':
            const departments = await getDepartments();
            const { roleTitle, roleSalary, departmentIdForRole } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: 'Enter the role title:'
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Enter the role salary:'
                },
                {
                    type: 'list',
                    name: 'departmentIdForRole',
                    message: 'Select the department:',
                    choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
                }
            ]);
            await addRole(roleTitle, roleSalary, departmentIdForRole);
            console.log(`Role ${roleTitle} added to department ID ${departmentIdForRole}.`);
            break;

        // Add a new employee
        case 'Add an employee':
            const roles = await getRoles();
            const employees = await getEmployees();
            const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the employee\'s first name:'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the employee\'s last name:'
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Select the role:',
                    choices: roles.map(role => ({ name: role.title, value: role.id }))
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Select the employee\'s manager:',
                    choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
                }
            ]);
            await addEmployee(firstName, lastName, roleId, managerId);
            console.log(`Employee ${firstName} ${lastName} added.`);
            break;

        // Update employee role
        case 'Update an employee role':
            const employeesList = await getEmployees();
            const { employeeToUpdateId } = await inquirer.prompt({
                type: 'list',
                name: 'employeeToUpdateId',
                message: 'Select the employee:',
                choices: employeesList.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
            });
            const rolesList = await getRoles();
            const { newRoleId } = await inquirer.prompt({
                type: 'list',
                name: 'newRoleId',
                message: 'Select the new role:',
                choices: rolesList.map(role => ({ name: role.title, value: role.id }))
            });
            await updateEmployeeRole(employeeToUpdateId, newRoleId);
            console.log('Employee role updated.');
            break;

        // Update employee manager
        case 'Update employee manager':
            const employeesListForManagerUpdate = await getEmployees();
            const { employeeId } = await inquirer.prompt({
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee:',
                choices: employeesListForManagerUpdate.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
            });
            const { newManagerId } = await inquirer.prompt({
                type: 'list',
                name: 'newManagerId',
                message: 'Select the new manager:',
                choices: employeesListForManagerUpdate.map(mgr => ({ name: `${mgr.first_name} ${mgr.last_name}`, value: mgr.id }))
            });
            await updateEmployeeManager(employeeId, newManagerId);
            console.log('Employee manager updated.');
            break;

        // View employees by manager
        case 'View employees by manager':
            const managers = await getEmployees();
            const { selectedManagerId } = await inquirer.prompt({
                type: 'list',
                name: 'selectedManagerId',
                message: 'Select a manager:',
                choices: managers.map(mgr => ({ name: `${mgr.first_name} ${mgr.last_name}`, value: mgr.id }))
            });
            console.table(await getEmployeesByManager(selectedManagerId));
            break;

            case 'View employees by department':
                const departmentsList = await getDepartments();
                const { departmentId } = await inquirer.prompt({
                    type: 'list',
                    name: 'departmentId',
                    message: 'Select a department:',
                    choices: departmentsList.map(dept => ({ name: dept.name, value: dept.id }))
                });
                console.table(await getEmployeesByDepartment(departmentId));
                break;
            
        // Delete a department
        case 'Delete a department':
            const deleteDepartments = await getDepartments();
            const { departmentToDeleteId } = await inquirer.prompt({
                type: 'list',
                name: 'departmentToDeleteId',
                message: 'Select a department to delete:',
                choices: deleteDepartments.map(dept => ({ name: dept.name, value: dept.id }))
            });
            await deleteDepartment(departmentToDeleteId);
            console.log('Department deleted.');
            break;

        // Delete a role
        case 'Delete a role':
            const deleteRoles = await getRoles();
            const { roleToDeleteId } = await inquirer.prompt({
                type: 'list',
                name: 'roleToDeleteId',
                message: 'Select a role to delete:',
                choices: deleteRoles.map(role => ({ name: role.title, value: role.id }))
            });
            await deleteRole(roleToDeleteId);
            console.log('Role deleted.');
            break;

        // Delete an employee
        case 'Delete an employee':
            const deleteEmployees = await getEmployees();
            const { employeeToDeleteId } = await inquirer.prompt({
                type: 'list',
                name: 'employeeToDeleteId',
                message: 'Select an employee to delete:',
                choices: deleteEmployees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
            });
            await deleteEmployee(employeeToDeleteId);
            console.log('Employee deleted.');
            break;

        case 'Exit':
            process.exit();
    }

    // Handle user choices
switch (choice) {
    // Other cases ...

    // View employees by department
    case 'View employees by department':
        const departmentsList = await getDepartments();
        const { departmentId } = await inquirer.prompt({
            type: 'list',
            name: 'departmentId',
            message: 'Select a department:',
            choices: departmentsList.map(dept => ({ name: dept.name, value: dept.id }))
        });
        const employeesByDepartment = await getEmployeesByDepartment(departmentId);
        
        if (employeesByDepartment.length === 0) {
            console.log('No employees found in this department.');
        } else {
            console.table(employeesByDepartment);
        }
        break;

    // Other cases ...

    case 'Exit':
        process.exit();
}
    // Recursively call mainMenu to show the menu again after an action
    mainMenu();
};

// Start the application by calling the mainMenu function
mainMenu();


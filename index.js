const db = require('./db/connection');
const inquirer = require('inquirer');
const Department = require('./lib/department');
const Role = require('./lib/role');
const Employee = require('./lib/employee');
//const {DBconnect, DBdisconnect, init} = require('./utils/basePrompt');

db.connect(err => {
    if (err) throw err;
});

const department = new Department();
const role = new Role();
const employee = new Employee();

const init = () => {
    inquirer 
        .prompt({
            type: 'list',
            name: 'actionChoice',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 
            'Add a department', 'Add a role', 'Add an employee', 
            'Update an employee role', 'Update an employee manager',
            'View employees by manager', 'View employees by department',
            'Delete an employee', 'Delete a role', 'Delete a department',
            'View total utilized budget', 'Exit']
        })
        .then(answer => {
            switch (answer.actionChoice) {
                case 'View all departments':
                    return department.viewAllDepartment();                
                case 'View all roles':
                    return role.viewAllRole();
                case 'View all employees':
                    return employee.viewAllEmployee();
                case 'Add a department':
                    return department.addDepartment();
                case 'Add a role':
                    return role.addRole();
                case 'Add an employee':
                    return employee.addEmployee();
                case 'Update an employee role':
                    return employee.updateEmployeeRole();
                case 'Update an employee manager':
                    return employee.updateEmployeeManager();
                case 'View employees by manager':
                    return employee.viewEmployeeByManager(); 
                case 'View employees by department':
                    return employee.viewEmployeeByDepartment();
                case 'Delete an employee':
                    return employee.deleteEmployee();
                case 'Delete a role':
                    return;
                case 'Delete a department':
                    return;
                case 'View total utilized budget':
                    return;
                case 'Exit':
                    process.exit();
            }
        })
        .then(() => init());

};
//DBconnect();

init();

//DBdisconnect();

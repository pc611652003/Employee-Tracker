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
            'Update an employee role', 'Exit']
        })
        .then(answer => {
            switch (answer.actionChoice) {
                case 'View all departments':
                    department.viewAllDepartment()
                    .then(() => init());
                    return;                
                case 'View all roles':
                    role.viewAllRole()
                    .then(() => init());
                    return;
                case 'View all employees':
                    employee.viewAllEmployee()
                    .then(() => init());
                    return;
                case 'Add a department':
                    department.addDepartment()
                    .then(() => init()); 
                    return;
                case 'Add a role':
                    department.getDepartmentList()
                    .then((list) => {
                        role.addRole(list)
                        .then(() => init());
                    })
                    return;
                case 'Add an employee':
                    return;
                case 'Update an employee role':
                    return;
                case 'Delete a department':
                    return;
                case 'Exit':
                    process.exit();
            }
        })

};
//DBconnect();

init();

//DBdisconnect();

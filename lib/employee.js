const db = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Department = require('./department');
const Role = require('./role');

class Employee {
    constructor() {}

    viewAllEmployee() {
        const sqlId = 'employees.id as "ID"';
        const sqlFirstName = 'employees.first_name as "First Name"';
        const sqlLastName = 'employees.last_name as "Last Name"';
        const sqlTitle = 'role.title as "Job Title"';
        const sqlSalary = 'role.salary as "Salary"';
        const sqlDepartment = 'department.name as "Department"';
        const sqlManager = 'CONCAT(manager.first_name, " ", manager.last_name) as "Manager"'

        const sql = `${sqlId}, ${sqlFirstName}, ${sqlLastName}, ${sqlTitle}, ${sqlDepartment}, ${sqlSalary}, ${sqlManager}`;

        const joinRole = 'LEFT JOIN role ON employees.role_id = role.id';
        const joinDepartment = 'LEFT JOIN department ON role.department_id = department.id';
        const joinSelf = 'LEFT JOIN employee manager ON employees.manager_id = manager.id';

        const joinStatement = `${joinRole} ${joinDepartment} ${joinSelf}`;

        return db.promise().query(`SELECT ${sql} FROM employee employees ${joinStatement}`)
            .then(([rows,fields]) => {
                console.table("Employees", rows);
            })
            .catch((err) => {console.log(err)});
    };

    addEmployee(roleList) {
        return inquirer
                    .prompt([{
                        type: 'input',
                        name: 'firstName',
                        message: "What is the employee's first name?",
                        validate: firstName => {
                            if (firstName) {
                                return true;
                            } else {
                                console.log("Please enter the employee's first name!");
                                return false;
                            }
                        }
                    },{
                        type: 'input',
                        name: 'lastName',
                        message: "What is the employee's last name?",
                        validate: lastName => {
                            if (lastName) {
                                return true;
                            } else {
                                console.log("Please enter the employee's last name!");
                                return false;
                            }
                        }
                    },{
                        type: 'list',
                        name: 'roleDepartment',
                        message: 'Which department does the role belong to?',
                        choices: departmentList
                    }])
                    .then(answer => {
                        var department = new Department();
                        return department.getDepartmentID(answer.roleDepartment)
                        .then((departmentId) => {
                            var detail = { 
                                name: answer.roleName,
                                salary: answer.roleSalary,
                                id: departmentId
                            };
                            return detail;
                        })
                    })
                    .then((roleDetail) => {
                        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                        const params = [roleDetail.name, roleDetail.salary, roleDetail.id];
                        return db.promise().query(sql, params)
                                .then(() => {
                                    console.log(`Added ${roleDetail.name} to the database!`);
                                })
                                .catch((err) => console.log(err));
                    });
    }

    getEmployeeList() {
        return db.promise().query('SELECT CONCAT(first_name, " ", last_name) as name FROM employee')
            .then(([rows,fields]) => {
                var nameList = ["None"];
                rows.forEach(element => {nameList.push(element.name)});
                console.log(nameList);
                return nameList;
            })
            .catch((err) => {console.log(err)});
    }

    getEmployeeID(target) {
        return db.promise().query(`SELECT id FROM employee where CONCAT(first_name, " ", last_name) = "${target}"`)
            .then(([rows,fields]) => {
                console.log(rows[0].id);
                return rows[0].id;
            })
            .catch((err) => {console.log(err)});
    }
}

module.exports = Employee;
const db = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Department = require('./department');

class Role {
    constructor() {}

    viewAllRole() {
        const sqlId = 'role.id as "ID"';
        const sqlTitle = 'role.title as "Job Title"';
        const sqlSalary = 'role.salary as "Salary"';
        const sqlDepartment = 'department.name as "Department"';

        const sql = `${sqlId}, ${sqlTitle}, ${sqlSalary}, ${sqlDepartment}`;

        const joinStatement = 'LEFT JOIN department ON role.department_id = department.id';
        
        return db.promise().query(`SELECT ${sql} FROM role ${joinStatement}`)
            .then(([rows,fields]) => {
                console.table("Roles", rows);
            })
            .catch((err) => {console.log(err)});
    };

    addRole(departmentList) {
        return inquirer
                    .prompt([{
                        type: 'input',
                        name: 'roleName',
                        message: 'What is the name of the role?',
                        validate: roleName => {
                            if (roleName) {
                                return true;
                            } else {
                                console.log("Please enter the name of the role!");
                                return false;
                            }
                        }
                    },{
                        type: 'input',
                        name: 'roleSalary',
                        message: 'What is the salary of the role?',
                        validate: roleSalary => {
                            if (roleSalary) {
                                return true;
                            } else {
                                console.log("Please enter the salary of the role!");
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

    getRoleList() {
        return db.promise().query('SELECT title FROM role')
            .then(([rows,fields]) => {
                var roleList = [];
                rows.forEach(element => {roleList.push(element.title)});
                return roleList;
            })
            .catch((err) => {console.log(err)});
    }

    getRoleID(target) {
        return db.promise().query(`SELECT id FROM role where title = "${target}"`)
            .then(([rows,fields]) => {
                return rows[0].id;
            })
            .catch((err) => {console.log(err)});
    }
}

module.exports = Role;
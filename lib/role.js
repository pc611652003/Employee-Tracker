const db = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Department = require('./department');

class Role {
    constructor() {}

    //----------------------
    //    Main Functions
    //----------------------

    // Display all the Role in the database
    viewAllRole() {
        // Create partial sql commands for data request
        const sqlId = 'role.id as "ID"';
        const sqlTitle = 'role.title as "Job Title"';
        const sqlSalary = 'role.salary as "Salary"';
        const sqlDepartment = 'department.name as "Department"';

        // Combine all data request into one
        const sql = `${sqlId}, ${sqlTitle}, ${sqlSalary}, ${sqlDepartment}`;

        // Create partial sql command for joining table
        const joinStatement = 'LEFT JOIN department ON role.department_id = department.id';
        
        // Request all role data and display them
        return db.promise().query(`SELECT ${sql} FROM role ${joinStatement}`)
            .then(([rows,fields]) => {
                console.table("Roles", rows);
            })
            .catch((err) => {console.log(err)});
    }

    // Add a New Role
    addRole() {
        var department = new Department();
        // Get the List of Department for user to choose from
        return department.getDepartmentList()
                        // Using the list of department to deploy the inquirer
                        .then((departmentList) => {
                            return inquirer
                                        // Get the details of the new role
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
                                        // Convert chosen department to corresponding department id
                                        .then(answer => {
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
                                        // Add the new Role
                                        .then(roleDetail => {
                                            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                                            const params = [roleDetail.name, roleDetail.salary, roleDetail.id];
                                            return db.promise().query(sql, params)
                                                    .then(() => {
                                                        console.log(`Added ${roleDetail.name} to the role database!`);
                                                    })
                                                    .catch((err) => console.log(err));
                                        });
                        });
    }

    deleteRole() {
        // Get the List of Role for user to choose from
        return this.getRoleList()
            .then(roleList => {
                return inquirer
                    // Get the info of the role user wants to delete
                    .prompt({
                        type: 'list',
                        name: 'roleTarget',
                        message: 'Which role do you want to delete?',
                        choices: roleList
                    })
                    // Get the id of the chosen role
                    .then(answer => {
                        return this.getRoleID(answer.roleTarget)
                            .then(roleID => {
                                var detail = {
                                    name: answer.roleTarget,
                                    id: roleID
                                };
                                return detail;
                            })
                    })
                    .then(roleDetail => {
                        return this.deleteSingleRole(roleDetail);
                    })
            })
    }

    //---------------------
    // Utilities Functions
    //---------------------

    // Return an array of roles
    getRoleList() {
        return db.promise().query('SELECT title FROM role')
            .then(([rows,fields]) => {
                var roleList = [];
                rows.forEach(element => {roleList.push(element.title)});
                return roleList;
            })
            .catch((err) => {console.log(err)});
    }

    // Return the id of the corresponding role
    getRoleID(target) {
        return db.promise().query(`SELECT id FROM role where title = "${target}"`)
            .then(([rows,fields]) => {
                return rows[0].id;
            })
            .catch((err) => {console.log(err)});
    }

    deleteSingleRole(roleDetail) {
        const sql = `DELETE FROM role WHERE id = ?`;
        const params = [roleDetail.id];
        return db.promise().query(sql, params)
                .then(() => {
                    console.log(`Deleted ${roleDetail.name} from the database!`);
                })
                .catch((err) => console.log(err));
    }
}

module.exports = Role;
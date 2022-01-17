const db = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

class Department {
    constructor() {}

    //----------------------
    //    Main Functions
    //----------------------

    // Display all the Department in the database
    viewAllDepartment() {
        return db.promise().query('SELECT id as "ID", name as "Name" FROM department')
            .then(([rows,fields]) => {
                console.table("Department", rows);
            })
            .catch((err) => {console.log(err)});
    };

    // Add a new department
    addDepartment() {
        return inquirer
                    // Get the name of the new department
                    .prompt({
                        type: 'input',
                        name: 'departmentName',
                        message: 'What is the name of the department?',
                        validate: departmentName => {
                            if (departmentName) {
                                return true;
                            } else {
                                console.log("Please enter the name of the department!");
                                return false;
                            }
                        }
                    })
                    // Add the new department
                    .then(answer => {
                        const sql = `INSERT INTO department (name) VALUES (?)`;
                        const params = [answer.departmentName];
                        return db.promise().query(sql, params)
                                .then(() => {
                                    console.log(`Added ${answer.departmentName} to the department database!`);
                                })
                                .catch((err) => console.log(err));
                    });
    }

    deleteDepartment() {
        // Get the List of Role for user to choose from
        return this.getDepartmentList()
            .then(departmentList => {
                return inquirer
                    // Get the info of the role user wants to delete
                    .prompt({
                        type: 'list',
                        name: 'departmentTarget',
                        message: 'Which department do you want to delete?',
                        choices: departmentList
                    })
                    // Get the id of the chosen role
                    .then(answer => {
                        return this.getDepartmentID(answer.departmentTarget)
                            .then(departmentID => {
                                var detail = {
                                    name: answer.departmentTarget,
                                    id: departmentID
                                };
                                return detail;
                            })
                    })
                    // Delete the chosen department
                    .then(departmentDetail => {
                        return this.deleteSingleDepartment(departmentDetail);
                    })
            })
    }

    //---------------------
    // Utilities Functions
    //---------------------

    // Return an array of departments
    getDepartmentList() {
        return db.promise().query('SELECT name FROM department')
            .then(([rows,fields]) => {
                var departmentList = [];
                rows.forEach(element => {departmentList.push(element.name)});
                return departmentList;
            })
            .catch((err) => {console.log(err)});
    }

    // Return the id of the corresponding department
    getDepartmentID(target) {
        return db.promise().query(`SELECT id FROM department where name = "${target}"`)
            .then(([rows,fields]) => {
                return rows[0].id;
            })
            .catch((err) => {console.log(err)});
    }

    // Delete a department
    deleteSingleDepartment(departmentDetail) {
        const sql = `DELETE FROM department WHERE id = ?`;
        const params = [departmentDetail.id];
        return db.promise().query(sql, params)
                .then(() => {
                    console.log(`Deleted ${departmentDetail.name} from the database!`);
                    return;
                })
                .catch((err) => console.log(err));
    }
}

module.exports = Department;
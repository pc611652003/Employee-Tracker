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
}

module.exports = Department;
const db = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Department = require('./department');
const Role = require('./role');

class Employee {
    constructor() {}

    //----------------------
    //    Main Functions
    //----------------------

    // Display all the Employee in the database
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

    // Display Employees by Manager
    viewEmployeeByManager() {
        // Get the list of Current Managers for user to choose from
        return this.getManagerList()
            .then(managerList => {
                return inquirer
                    // Get which manager user is trying to view
                    .prompt({
                        type: 'list',
                        name: 'manager',
                        message: 'Which manager do you want to view employees by?',
                        choices: managerList
                    })
                    // Convert chosen manager to manager id
                    .then(answer => {
                        return this.getEmployeeID(answer.manager);
                    })
                    // Display all employee under the chosen manager
                    .then(managerId => {
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

                        var filtersql = ``;
                        if (managerId == null) {
                            filtersql = 'manager.id IS NULL';
                        } else {
                            filtersql = `manager.id = ${managerId}`;
                        }

                        return db.promise().query(`SELECT ${sql} FROM employee employees ${joinStatement} where ${filtersql}`)
                            .then(([rows,fields]) => {
                                console.table("Employees", rows);
                            })
                            .catch((err) => {console.log(err)});
                    })
            })        
    }

    // Display Employees by Department
    viewEmployeeByDepartment() {
        var department = new Department();
        // Get the list of Departments for user to choose from
        return department.getDepartmentList()
            .then(departmentList => {
                return inquirer
                    // Get which department user is trying to view
                    .prompt({
                        type: 'list',
                        name: 'Dept',
                        message: 'Which department do you want to view employees by?',
                        choices: departmentList
                    })
                    // Convert chosen department to department id
                    .then(answer => {
                        return department.getDepartmentID(answer.Dept);
                    })
                    // Display all employee under the chosen manager
                    .then(departmentId => {
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

                        const filtersql = `department.id = ${departmentId}`;

                        return db.promise().query(`SELECT ${sql} FROM employee employees ${joinStatement} where ${filtersql}`)
                            .then(([rows,fields]) => {
                                console.table("Employees", rows);
                            })
                            .catch((err) => {console.log(err)});
                    })
            })
    }

    // Add an new employee
    addEmployee() {
        var role = new Role();
        // Get the list of role for user to choose from
        return role.getRoleList()
            .then((roleList) => {
                // Get the list of Possible Manager for user to choose a manager from
                return this.getPotentialManagerList()
                    .then((managerList) => {
                        return inquirer
                                    // Get the details of the new employee
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
                                        name: 'employeeRole',
                                        message: "What is the employee's role?",
                                        choices: roleList
                                    },{
                                        type: 'list',
                                        name: 'employeeManager',
                                        message: "Who is the employee's manager?",
                                        choices: managerList
                                    }])
                                    // Convert chosen role to corresponding role id
                                    .then(answer => {
                                        return role.getRoleID(answer.employeeRole)
                                        .then((roleId) => {
                                            var detail = { 
                                                firstName: answer.firstName,
                                                lastName: answer.lastName,
                                                roleId: roleId,
                                                employeeManager: answer.employeeManager
                                            };
                                            return detail;
                                        })
                                    })
                                    // Convert chosen manager to corresponding employee id
                                    .then(updatedAnswer => {
                                        var updatedDetail = {};
                                        return this.getEmployeeID(updatedAnswer.employeeManager)
                                        .then((managerId) => {
                                            updatedDetail = { 
                                                firstName: updatedAnswer.firstName,
                                                lastName: updatedAnswer.lastName,
                                                roleId: updatedAnswer.roleId,
                                                managerId: managerId
                                            };
                                            return updatedDetail;
                                        })
                                    })
                                    // Add the new Employee
                                    .then((finalDetail) => {
                                        console.log(finalDetail);
                                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                                        const params = [finalDetail.firstName, finalDetail.lastName, finalDetail.roleId, finalDetail.managerId];
                                        return db.promise().query(sql, params)
                                                .then(() => {
                                                    console.log(`Added ${finalDetail.firstName} ${finalDetail.lastName} to the employee database!`);
                                                })
                                                .catch((err) => console.log(err));
                                    });
                    });
            });
    }

    // Update Employee's Role
    updateEmployeeRole() {
        var role = new Role();
        // Get the list of role for user to choose from
        return role.getRoleList()
            .then((roleList) => {
                // Get the list of employee for user to choose from
                return this.getEmployeeList()
                    .then((employeeList) => {
                        return inquirer
                                    // Get the target employee and target role
                                    .prompt([{
                                        type: 'list',
                                        name: 'employeeTarget',
                                        message: "Which employee's role do you want to update?",
                                        choices: employeeList
                                    },{
                                        type: 'list',
                                        name: 'employeeRole',
                                        message: "Which role do you want to update to?",
                                        choices: roleList
                                    }])
                                    // Get the employee ID according to user's input
                                    .then(answer => {
                                        return this.getEmployeeID(answer.employeeTarget)
                                        .then(employeeID => {
                                            var detail = {
                                                name: answer.employeeTarget,
                                                id: employeeID,
                                                role: answer.employeeRole
                                            };
                                            return detail;
                                        })
                                    })
                                    // Get the ID of the employee's new role according to user's input
                                    .then(detail => {
                                        return role.getRoleID(detail.role)
                                        .then((employeeNewRole) => {
                                            var updatedDetail = {
                                                name: detail.name,
                                                id: detail.id,
                                                role: detail.role,
                                                roleId: employeeNewRole
                                            };
                                            return updatedDetail;
                                        })
                                    })
                                    // Update the employee's role to the new role
                                    .then(updatedDetail => {
                                        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                                        const params = [updatedDetail.roleId, updatedDetail.id];
                                        return db.promise().query(sql, params)
                                                .then(() => {
                                                    console.log(`Updated ${updatedDetail.name}'s role to ${updatedDetail.role}!`);
                                                })
                                                .catch((err) => console.log(err));
                                    })
                    })
            })
    }

    // Update Employee's Manager
    updateEmployeeManager() {
        // Get the list of employee for user to choose from
        return this.getEmployeeList()
            .then(employeeList => {
                // Get the list of possible manager for user to choose from
                return this.getPotentialManagerList()
                .then (managerList => {
                    return inquirer
                                // Get the target employee and target role
                                .prompt([{
                                    type: 'list',
                                    name: 'employeeTarget',
                                    message: "Which employee's manager do you want to update?",
                                    choices: employeeList
                                },{
                                    type: 'list',
                                    name: 'employeeManager',
                                    message: "Which manager do you want to update to?",
                                    choices: managerList
                                }])
                                // Get the employee ID according to user's input
                                .then(answer => {
                                    return this.getEmployeeID(answer.employeeTarget)
                                    .then(employeeID => {
                                        var detail = {
                                            name: answer.employeeTarget,
                                            id: employeeID,
                                            manager: answer.employeeManager
                                        };
                                        return detail;
                                    })
                                })
                                // Get the ID of the employee's new manager according to user's input
                                .then(detail => {
                                    return this.getEmployeeID(detail.manager)
                                    .then((employeeNewManager) => {
                                        var updatedDetail = {
                                            name: detail.name,
                                            id: detail.id,
                                            manager: detail.manager,
                                            managerId: employeeNewManager
                                        };
                                        return updatedDetail;
                                    })
                                })
                                // Update the employee's manager to the new manager
                                .then(updatedDetail => {
                                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
                                    const params = [updatedDetail.managerId, updatedDetail.id];
                                    return db.promise().query(sql, params)
                                            .then(() => {
                                                console.log(`Updated ${updatedDetail.name}'s manager to ${updatedDetail.manager}!`);
                                            })
                                            .catch((err) => console.log(err));
                                })
                })            
            })
    }

    // Delete Employee
    deleteEmployee() {
        // Get the List of Employee for user to choose from
        return this.getEmployeeList()
            .then(employeeList => {
                return inquirer
                    // Get which employee is going to be deleted
                    .prompt({
                        type: 'list',
                        name: 'employeeTarget',
                        message: 'Which employee do you want to delete?',
                        choices: employeeList
                    })
                    // Get the ID of the chosen employee
                    .then(answer => {
                        return this.getEmployeeID(answer.employeeTarget)
                            .then(employeeID => {
                                var detail = {
                                    name: answer.employeeTarget,
                                    id: employeeID
                                };
                                return detail;
                            })
                    })
                    // Delete the corresponding employee
                    .then(employeeDetail => {
                        return this.deleteSingleEmployee(employeeDetail);
                    })
            })
    }


    //---------------------
    // Utilities Functions
    //---------------------

    // Return an array of employees
    getEmployeeList() {
        return db.promise().query('SELECT CONCAT(first_name, " ", last_name) as name FROM employee')
            .then(([rows,fields]) => {
                var nameList = [];
                rows.forEach(element => {nameList.push(element.name)});
                return nameList;
            })
            .catch((err) => {console.log(err)});
    }

    // Return an array of possible manager
    getPotentialManagerList() {
        return db.promise().query('SELECT CONCAT(first_name, " ", last_name) as name FROM employee')
            .then(([rows,fields]) => {
                var nameList = ["None"];
                rows.forEach(element => {nameList.push(element.name)});
                return nameList;
            })
            .catch((err) => {console.log(err)});
    }

    getManagerList() {
        return db.promise().query('SELECT DISTINCT CONCAT(manager.first_name, " ", manager.last_name) as name FROM employee employees LEFT JOIN employee manager ON employees.manager_id = manager.id')
            .then(([rows,fields]) => {
                console.log(rows);
                var nameList = ["None"];
                rows.forEach(element => {
                    if (element.name != null) {
                        nameList.push(element.name);
                    }
                });
                console.log(nameList);
                return nameList;
            })
            .catch((err) => {console.log(err)});
    }

    // Return the id of the corresponding employee
    getEmployeeID(target) {
        return db.promise().query(`SELECT id FROM employee where CONCAT(first_name, " ", last_name) = "${target}"`)
            .then(([rows,fields]) => {
                if (rows[0]) {
                    return rows[0].id;
                } else {
                    return null;
                }
            })
            .catch((err) => {console.log(err)});
    }

    // Update the manager of a group of employees
    updateGroupManager(oldManager, newManager) {
        const sql = `UPDATE employee SET manager_id = ? WHERE manager_id = ?`;
        const params = [newManager.id, oldManager.id];
        return db.promise().query(sql, params)
            .then(() => {
                console.log(`Updated ${oldManager.name}'s staff to report to ${newManager.name}!`);
            })
            .catch((err) => console.log(err));
    }

    // Delete an employee
    deleteSingleEmployee(employeeDetail) {
        const sql = `DELETE FROM employee WHERE id = ?`;
        const params = [employeeDetail.id];
        return db.promise().query(sql, params)
                .then(() => {
                    console.log(`Deleted ${employeeDetail.name} from the database!`);
                    var newManager = {
                        id: null,
                        name: "no one"
                    }
                    return this.updateGroupManager(employeeDetail, newManager);
                })
                .catch((err) => console.log(err));
    }
}

module.exports = Employee;
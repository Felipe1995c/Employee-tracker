// Dependencies
const inquirer = require('inquirer');
const cTable  = require('console.table');
const { Pool } = require('pg');

// Used to create connection with database
const pool = new Pool({
  user: "postgres",
  password: "",
  host: "localhost",
  database: "employee_trackerdb"
});
const PORT = 5432;

// This is what will be displayed on the terminal as prompts
const mainMenu = async () => {
  const answers = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ],
  });

  switch (answers.action) {
    case 'View all departments':
      await viewAllDepartments();
      break;
    case 'View all roles':
      await viewAllRoles();
      break;
    case 'View all employees':
      await viewAllEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    case 'Exit':
      process.exit();
      break;
  }
};
//!VIEW ALL DEPARTMENTS----//
const viewAllDepartments = async () => {
  pool.query('SELECT * FROM department ORDER BY name', (err, res)=> {
    if(err) throw err;
    // console.log(res); 
    res.rows.forEach(({name}) => {
      console.table({Department: `${name}`});
    });
  
  mainMenu();
  });
};

// VIEW ALL ROLES------//

const viewAllRoles = async () => {
  pool.query(`
    SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    JOIN department ON role.department_id = department.id
  `, (err, res)=> {
    if(err) throw err;
    res.rows.forEach(({title, salary}) => {
      console.table({Title: `${title}`,Salary: `${salary}`});
    });
  });
  mainMenu();
};


//VIEW ALL EMPLOYEES//

const viewAllEmployees = async () => {
query = (`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `);
  pool.query(query, (err, res) => {
    if (err) throw(err);
    res.rows.forEach(({  employee_id, first_name, last_name, title, salary, department_name}) => {
      console.table({ Employee_ID: `${employee_id}`, First_Name: `${first_name}`, Last_Name: `${last_name}`, Title: `${title}`, Salary: `${salary}`, Department: `${department_name}` });
    
    });
    mainMenu();
});
};

// ADD DEPARTMENT//

const addDepartment = async () => {
  const answers = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter the name of the department:',
  });

  await pool.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
  console.log(`Department ${answers.name} added.`);
  mainMenu();
};

// ADD ROLE //

const addRole = async () => {
  const departments = await pool.query('SELECT * FROM department');
  const departmentChoices = departments.rows.map(department => ({
    name: department.name,
    value: department.id
  }));

  const answers = await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'Enter the title of the role:'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Enter the salary for the role:'
    },
    {
      name: 'department_id',
      type: 'list',
      message: 'Select the department for the role:',
      choices: departmentChoices
    }
  ]);

  await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
  console.log(`Role ${answers.title} added.`);
  mainMenu();
};

// ADD EMPLOYEE-----//

const addEmployee = async () => {
  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));

  const employees = await pool.query('SELECT * FROM employee');
  const managerChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));
  managerChoices.push({ name: 'None', value: null });

  const answers = await inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'Enter the first name of the employee:'
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Enter the last name of the employee:'
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'Select the role for the employee:',
      choices: roleChoices
    },
    {
      name: 'manager_id',
      type: 'list',
      message: 'Select the manager for the employee:',
      choices: managerChoices
    }
  ]);

  await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
  console.log(`Employee ${answers.first_name} ${answers.last_name} added.`);
  mainMenu();
};

//UPDATE EMPLOYEE-----//

const updateEmployeeRole = async () => {
  const employees = await pool.query('SELECT * FROM employee');
  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));

  const answers = await inquirer.prompt([
    {
      name: 'employee_id',
      type: 'list',
      message: 'Select the employee to update:',
      choices: employeeChoices
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'Select the new role for the employee:',
      choices: roleChoices
    }
  ]);

  await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
  console.log(`Employee role updated.`);
  mainMenu();
};

mainMenu();
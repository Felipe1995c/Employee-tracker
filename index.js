import pkg from 'pg';
const { Client } = pkg;
import inquirer from 'inquirer';
import cTable from 'console.table';

// Database client configuration
const client = new Client({
  user: 'your_username',
  host: 'localhost',
  database: 'employee_management',
  password: 'your_password',
  port: 5432,
});

// Connect to the database
client.connect();

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
      client.end();
      break;
  }
};

const viewAllDepartments = async () => {
  const res = await client.query('SELECT * FROM department');
  console.table(res.rows);
  mainMenu();
};

const viewAllRoles = async () => {
  const res = await client.query(`
    SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  console.table(res.rows);
  mainMenu();
};

const viewAllEmployees = async () => {
  const res = await client.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `);
  console.table(res.rows);
  mainMenu();
};

const addDepartment = async () => {
  const answers = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter the name of the department:',
  });

  await client.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
  console.log(`Department ${answers.name} added.`);
  mainMenu();
};

const addRole = async () => {
  const departments = await client.query('SELECT * FROM department');
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

  await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
  console.log(`Role ${answers.title} added.`);
  mainMenu();
};

const addEmployee = async () => {
  const roles = await client.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));

  const employees = await client.query('SELECT * FROM employee');
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

  await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
  console.log(`Employee ${answers.first_name} ${answers.last_name} added.`);
  mainMenu();
};

const updateEmployeeRole = async () => {
  const employees = await client.query('SELECT * FROM employee');
  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  const roles = await client.query('SELECT * FROM role');
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

  await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
  console.log(`Employee role updated.`);
  mainMenu();
};

mainMenu();
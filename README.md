# SQL: Employee Tracker

## Description
This command-line application allows users to manage departments, roles, and employees within a company. It provides options to view, add, and update information in a PostgreSQL database. The application uses Node.js, inquirer for interactive prompts, pg for database interaction, and console.table for displaying formatted tables.

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Mock-Up

The following video shows an example of the application being used from the command line:

![A video shows the command-line employee management application with a play button overlaying the view.]

## Getting Started

You’ll need to use the [pg package](https://www.npmjs.com/package/pg) to connect to your PostgreSQL database and perform queries, and the [Inquirer package](https://www.npmjs.com/package/inquirer/v/8.2.4) to interact with the user via the command line.

1. Install the packages required by entering "npm install"
2. Make sure you a .env file is created and filled in with sql username and password.
3. Then run the schema.sql file along with the seed files. (department, role, and employee).
4. Exit the sql database, then you can run index.js to get all the prompts.
5. Then just follow the prompts.

## Usage

Start by typing "node index.js" into the integrated terminal.
You will then be presented with a list of options that you will be able to access using the arrow keys and enter key.
The prompts will then give you a response.

-- Connect to the database
\c employee_trackerdb;

-- Insert departments
INSERT INTO department (name)
VALUES ('Accounting'), ('Admin'), ('Engineering'), ('HR'), ('CEO'), ('Design'), ('Labor');
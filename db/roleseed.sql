-- Connect to the database
\c employee_trackerdb;

-- Insert departments first to ensure department_id references work
INSERT INTO department (name)
VALUES ('Accounting'), ('Admin'), ('Engineering'), ('HR'), ('CEO'), ('Design'), ('Labor');

-- Insert roles after departments to ensure department_id references work
INSERT INTO role (title, salary, department_id)
VALUES
  ('Accountant', 60000, 1),
  ('Administrator', 50000, 2),
  ('Engineer', 70000, 3),
  ('HR Manager', 65000, 4),
  ('CEO', 150000, 5),
  ('Designer', 60000, 6),
  ('Laborer', 40000, 7);
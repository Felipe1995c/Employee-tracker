-- Connect to the database
\c employee_trackerdb;

-- Insert employees without managers first
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 5, NULL),   -- Assuming John Doe is the CEO and has no manager
    ('Jane', 'Smith', 4, NULL); -- Another top-level employee without a manager

-- Then insert employees who have managers
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Jim', 'Beam', 3, 1),    -- Manager is John Doe (id 1)
    ('Jack', 'Daniels', 3, 1),-- Manager is John Doe (id 1)
    ('Jill', 'Stein', 4, 1),  -- Manager is John Doe (id 1)
    ('Jake', 'Paul', 6, 3),   -- Manager is Jim Beam (id 3)
    ('Judy', 'Blume', 7, 3);  -- Manager is Jim Beam (id 3)
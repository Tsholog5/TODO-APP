CREATE TABLE todo_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    priority TEXT NOT NULL
);

INSERT INTO todo_items (name, priority)
VALUES
  ("Go to gym", 2),
  ("Do my assignment", 1),
  ("Do dishes", 3);

UPDATE todo_items
SET name = "Exercise"
WHERE name = "Go to gym";

DELETE FROM todo_items
WHERE name = "Do dishes";

SELECT name FROM todo_items
WHERE id = 1; 

DROP TABLE todo_items
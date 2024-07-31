-- Create the users table if it doesn't exist
CREATE TABLE  login(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Optionally, you can add some sample users for testing (make sure to hash passwords before inserting)
-- INSERT INTO users (username, password) VALUES ('testuser', 'hashedpassword');
INSERT INTO login (username,password)
VALUES(faithtsholofelo@gmail.com ,1234567)

ALTER TABLE users ADD COLUMN email TEXT UNIQUE;




CREATE TABLE  login(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

INSERT INTO login (username,password)
VALUES(faithtsholofelo@gmail.com ,1234567)

ALTER TABLE users ADD COLUMN email TEXT UNIQUE;



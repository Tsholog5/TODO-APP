CREATE TABLE register (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  confirm_password TEXT NOT NULL
);


INSERT INTO register (firstname, lastname, email, password, confirm_password)
VALUES ("Tsholo", "Gaarekwe", "faithtysholofelo@gmail.com", "12345678", "12345678");

UPDATE register
SET firstname = "Gaarekwe"
WHERE firstname = "Tsholo";

DELETE FROM register 
WHERE firstname = "T";

SELECT * FROM register 
WHERE id = 1;

DROP TABLE register;
EOF

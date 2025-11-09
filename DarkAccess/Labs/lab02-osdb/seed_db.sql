BEGIN TRANSACTION;
CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT);
INSERT INTO users (username, password, role) VALUES
  ('alice', 'alice_pass', 'user'),
  ('bob', 'bob_pass', 'admin');

CREATE TABLE accounts (id INTEGER PRIMARY KEY, owner TEXT, balance REAL);
INSERT INTO accounts (owner, balance) VALUES ('alice', 1024.5), ('bob', 50000);

CREATE TABLE secrets (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT);
INSERT INTO secrets (note) VALUES ('db_path=/var/lib/db/main.sqlite'), ('admin_user=root'), ('admin_pass=D4ll3_Adm!n_2025');

COMMIT;

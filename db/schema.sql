--DROP DATABASE IF EXISTS jungleknight;
CREATE DATABASE jungleknight;

USE jungleknight;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  create_date TIMESTAMP,
  last_login TIMESTAMP,
  currentrunid_fk INT,
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS run;
CREATE TABLE run (
  id INT NOT NULL AUTO_INCREMENT,
  userid_fk INT NOT NULL,
  act_num INT,
  encounter_num INT,
  seed VARCHAR(255),
  is_active BOOLEAN,
  run_start TIMESTAMP,
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS runitems;
CREATE TABLE runitems (
  id INT NOT NULL AUTO_INCREMENT,
  runid_fk INT NOT NULL,
  itemid_fk INT NOT NULL,
  upgradelevel INT default 0,
  removed BOOLEAN default 0,
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS runencounter;
CREATE TABLE runencounter (
  id INT NOT NULL AUTO_INCREMENT,
  runid_fk INT NOT NULL,
  encounterid_fk INT NOT NULL,
  PRIMARY KEY(id)
);

-- reference tables
DROP TABLE IF EXISTS hardware_ref;
CREATE TABLE hardware_ref (
  id INT NOT NULL AUTO_INCREMENT,

  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS software_ref;
CREATE TABLE software_ref (
  id INT NOT NULL AUTO_INCREMENT,

  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS encounter_ref;
CREATE TABLE encounter_ref (
  id INT NOT NULL AUTO_INCREMENT,

  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS enemy_ref;
CREATE TABLE enemy_ref (
  id INT NOT NULL AUTO_INCREMENT,

  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS enemy_attack_ref;
CREATE TABLE enemy_attack_ref (
  id INT NOT NULL AUTO_INCREMENT,

  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS enemy_attack_list;
CREATE TABLE enemy_attack_list (
  id INT NOT NULL AUTO_INCREMENT,

  PRIMARY KEY(id)
);

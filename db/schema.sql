DROP DATABASE IF EXISTS jungleknight;
CREATE DATABASE jungleknight;

USE jungleknight;

-- DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  create_date TIMESTAMP,
  last_login TIMESTAMP,
  currentrunid_fk INT,
  PRIMARY KEY(id)-- ,
  -- FOREIGN KEY (currentrunid_fk) REFERENCES run(id) ON DELETE SET NULL
);

-- DROP TABLE IF EXISTS run;
CREATE TABLE run (
  id INT NOT NULL AUTO_INCREMENT,
  userid_fk INT NOT NULL,
  act_num INT DEFAULT 1,
  encounter_num INT DEFAULT NULL,
  seed VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  run_start TIMESTAMP,
  PRIMARY KEY(id)-- ,
  -- FOREIGN KEY (userid_fk) REFERENCES users(id)
);

-- DROP TABLE IF EXISTS runitems;
CREATE TABLE runitems (
  id INT NOT NULL AUTO_INCREMENT,
  runid_fk INT NOT NULL,
  itemid_fk INT NOT NULL,
  upgradelevel INT default 0,
  removed BOOLEAN default 0,
  PRIMARY KEY(id),
  FOREIGN KEY (runid_fk) REFERENCES run(id)
);

-- DROP TABLE IF EXISTS runencounter;
CREATE TABLE runencounter (
  id INT NOT NULL AUTO_INCREMENT,
  runid_fk INT NOT NULL,
  encounterid_fk INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (runid_fk) REFERENCES run(id)-- ,
  -- FOREIGN KEY (encounterid_fk) REFERENCES encounter_ref(id)
);

-- reference tables
-- DROP TABLE IF EXISTS hardware_ref;
CREATE TABLE hardware_ref (
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(255) NOT NULL,
  icon VARCHAR(255) NOT NULL,
  item_desc VARCHAR(255) NOT NULL,
  mouseover VARCHAR(255) NOT NULL,
  damage_type INT NOT NULL,
  strength INT NOT NULL,
  rarity INT NOT NULL,
  PRIMARY KEY(id)
);

-- DROP TABLE IF EXISTS software_ref;
CREATE TABLE software_ref (
  id INT NOT NULL AUTO_INCREMENT,
  card_name VARCHAR(255) NOT NULL,
  icon VARCHAR(255) NOT NULL,
  card_desc VARCHAR(255) NOT NULL,
  damage_type INT NOT NULL,
  strength INT NOT NULL,
  upgrade_level INT NOT NULL,
  cooldown INT NOT NULL,
  initial_cooldown INT NOT NULL,
  rarity INT NOT NULL,
  PRIMARY KEY(id)
);

-- DROP TABLE IF EXISTS encounter_ref;
CREATE TABLE encounter_ref (
  id INT NOT NULL AUTO_INCREMENT,
  act INT NOT NULL,
  enemy1id_fk INT NOT NULL,
  enemy2id_fk INT NOT NULL,
  enemy3id_fk INT NOT NULL,
  enemy4id_fk INT NOT NULL,
  loot_rating INT NOT NULL,
  PRIMARY KEY(id)
);

-- DROP TABLE IF EXISTS enemy_ref;
CREATE TABLE enemy_ref (
  id INT NOT NULL AUTO_INCREMENT,
  enemy_name VARCHAR(255) NOT NULL,
  enemy_desc VARCHAR(255) NOT NULL,
  defense INT NOT NULL,
  damage_type INT NOT NULL,
  health INT NOT NULL,
  PRIMARY KEY(id)
);

-- DROP TABLE IF EXISTS enemy_attack_ref;
CREATE TABLE enemy_attack_ref (
  id INT NOT NULL AUTO_INCREMENT,
  attack_name VARCHAR(255) NOT NULL,
  attack_desc VARCHAR(255) NOT NULL,
  effect INT NOT NULL,
  damage_type INT NOT NULL,
  strength INT NOT NULL,
  turn_priority INT NOT NULL,
  PRIMARY KEY(id)
);

-- DROP TABLE IF EXISTS enemy_attack_list;
CREATE TABLE enemy_attack_list (
  id INT NOT NULL AUTO_INCREMENT,
  enemyid_fk INT NOT NULL,
  attackid_fk INT NOT NULL,
  PRIMARY KEY(id)
);
CREATE USER 'dbfavlinks'@'%' IDENTIFIED WITH mysql_native_password 't3st1ngp4ssw0rd';

GRANT USAGE ON *.* TO 'dbfavlinks'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;

CREATE DATABASE IF NOT EXISTS `dbfavlinks`;

GRANT ALL PRIVILEGES ON `dbfavlinks`.* TO 'dbfavlinks'@'%'; 

USE db-favlinks;

CREATE TABLE usuarios(
    id INT NOT NULL AUTO_INCREMENT,
    nombrecompleto VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL,
    username VARCHAR(32) NOT NULL,
    password VARCHAR(256) NOT NULL,
    PRIMARY KEY (id)
);

-- LINKS TABLE
CREATE TABLE links (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    descripcion TEXT,
    usuario_id INT,
    creado TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    PRIMARY KEY (id)
);

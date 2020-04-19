CREATE DATABASE peliculas;

use peliculas;

CREATE TABLE pelicula(
    id int not null auto_increment,
    titulo VARCHAR(100) not NULL,
    duracion int(5) not null,
    director VARCHAR(400) not null,
    anio INT(5) not null,
    fecha_lanzamiento date not null,
    puntuacion int(2) not null,
    poster VARCHAR(300) not null,
    trama VARCHAR(700) not null, 
    PRIMARY KEY(id)
);

create table genero (
id int not null auto_increment,
nombre varchar(30) not null,
primary key (id)
);

ALTER TABLE pelicula 
ADD COLUMN genero_id int,
 ADD CONSTRAINT fk_genero FOREIGN KEY (genero_id)
 REFERENCES genero(id);
 
 select * from genero;
 
 create table actor(
	    id int not null auto_increment,
        nombre varchar(70),
		PRIMARY KEY(id)
 );
 
 create table actor_pelicula (
	id int not null auto_increment,
	actor_id int not null,
    pelicula_id int not null,
    primary key(id),
    foreign key (actor_id) references actor(id),
    foreign key (pelicula_id) references pelicula(id)
 );
 
 select * from actor;

 SELECT pelicula.*, genero.nombre 
            FROM pelicula 
            LEFT JOIN genero ON (genero.id = pelicula.genero_id)
            WHERE pelicula.id = 5;
SELECT actor_pelicula.*, actor.NOMBRE
            FROM actor_pelicula
            LEFT JOIN actor ON (actor.id = actor_pelicula.actor_id)
            WHERE pelicula_id = 5;
SELECT pelicula.*, genero.nombre, actor.nombre FROM pelicula 
            INNER JOIN genero 
            ON (genero.id = pelicula.genero_id)
            INNER JOIN actor_pelicula 
            on (actor.id = actor_pelicula.actor_id)
            WHERE pelicula.id = 15;
      
use competencias;
create table competencia (
	id int not null auto_increment primary key,
	nombre varchar (700)
);

select * from competencia;

insert into competencia (nombre)
values 
	('¿Cual es la película más bizarra?'),
	('¿Cuál es mejor película?'),
	('¿Qué drama te hizo llorar más?'),
    ('¿Cuál peli de acción es mejor?');
    
Select p.titulo, p.poster, p.id from pelicula p order by rand() limit 0,2;
select competencia.nombre from competencia where id= 4;

CREATE TABLE voto(
	id int not null auto_increment,
    pelicula_id int unsigned not null, 
	competencia_id int not null,
    cantidad_votos int not null,
    primary key (id),
    foreign key (pelicula_id) references competencias.pelicula(id),
	foreign key (competencia_id) references competencias.competencia(id)
);

select * from voto;

select c.nombre from competencia c where c.id= 3;

Select v.pelicula_id, v.cantidad_votos as votos, p.titulo, p.poster 
from pelicula p 
inner join voto v 
on v.pelicula_id = p.id 
order by votos 
limit 0,3; 

Select v.pelicula_id, v.cantidad_votos as votos, p.titulo, p.poster 
from pelicula p, voto v
where v.pelicula_id = p.id 
order by votos 
limit 0,3; 

alter table competencias.competencia 
add column genero_id int unsigned,
ADD CONSTRAINT fk_genero foreign key (genero_id) references competencias.genero(id);


    
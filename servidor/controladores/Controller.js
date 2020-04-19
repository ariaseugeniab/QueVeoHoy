let conexion = require('../lib/conexionbd');

function mostrarPeliculas(req, res) {

    //PARAMETROS
    let anio = req.query.anio;
    let titulo = req.query.titulo;
    let genero = req.query.genero;
    let orden = req.query.columna_orden;
    let tipo_orden = req.query.tipo_orden;
    let pagina = req.query.pagina;
    let cantidad = (req.query.cantidad = 52) ? req.query.cantidad : undefined

    //FILTROS
    let queryFilters = [];
    let queryFiltersDB = [];
    let queryWhere = "";
    let query;

    //PUSH A LOS FILTROS
    if (titulo) {
        queryFilters.push("titulo");
        queryFiltersDB.push(titulo);
    };
    if (genero) {
        queryFilters.push("genero_id");
        queryFiltersDB.push(genero);
    };
    if (anio) {
        queryFilters.push("anio");
        queryFiltersDB.push(anio);
    };

    //SENTENCIAS WHERE
    switch (queryFilters.length) {
        case 1:
            queryWhere = `WHERE ${queryFilters[0]} like '%${queryFiltersDB[0]}%'`;
            break;
        case 2:
            queryWhere = `WHERE ${queryFilters[0]} like '%${queryFiltersDB[0]}%' AND ${queryFilters[1]} like '%${queryFiltersDB[1]}%'`;
            break;
        case 3:
            queryWhere = `WHERE ${queryFilters[0]} like '%${queryFiltersDB[0]}%' AND ${queryFilters[1]} like '%${queryFiltersDB[1]}%' AND ${queryFilters[2]} like '%${queryFiltersDB[2]}%'`;
            break;
    };

    //QUERIES
    query = `select * from pelicula ${queryWhere} order by ${orden} ${tipo_orden} limit ${(pagina - 1) * cantidad}, ${cantidad}`;

    let query2 = `select count(*) as cantidad from pelicula ${queryWhere}`;

    //CONEXIÓN A DB
    conexion.query(query, function (error, results) {
        if (error) throw error;

        conexion.query(query2, function (error, results2) {

            if (error) throw error;

            var respuesta = {
                peliculas: results,
                total: results2[0].cantidad
            };

            res.send(JSON.stringify(respuesta));
        });
    })
}

function mostrarGeneros(req, res) {
    let queryGen = 'select * from genero'

    //CONEXIÓN A DB
    conexion.query(queryGen, function (error, result) {
        if (error) throw error;

        var respuesta = {
            generos: result
        }

        res.send(JSON.stringify(respuesta))
    })

}

function mostrarinformacion(req, res) {

    //PARÁMETROS Y QUERIES
    let idPelicula = req.params.id
    let queryInfoPelicula =
        `SELECT pelicula.*, genero.nombre 
            FROM pelicula 
            LEFT JOIN genero ON (genero.id = pelicula.genero_id)
            WHERE pelicula.id =${idPelicula} `

    let queryInfoActor =
        `SELECT actor_pelicula.*, actor.NOMBRE as nombre
            FROM actor_pelicula
            LEFT JOIN actor ON (actor.id = actor_pelicula.actor_id)
            WHERE pelicula_id = ${idPelicula} `

    //CONEXIONES A LA DB
    conexion.query(queryInfoPelicula, function (error, results) {
        if (error) throw error;

        conexion.query(queryInfoActor, function (error, results2) {
            if (error) throw error;

            var respuesta = {
                pelicula: results[0],
                actores: results2,
                genero: results[0]
            };
            
            res.send(JSON.stringify(respuesta));

        });
    });
}

function recomendarPelicula(req, res) {

    //PARAMETROS
    let genero = req.query.genero
    let puntuacion = req.query.puntuacion
    let anioInicio = req.query.anio_inicio
    let anioFin = req.query.anio_fin

    //QUERIES
    let query = `SELECT p.*, g.nombre FROM pelicula p LEFT JOIN genero g ON p.genero_id = g.id`
    let queryAnios = `(anio BETWEEN  ${anioInicio} AND ${anioFin}) `;
    let queryGenero = `g.nombre = '${genero}' `;
    let queryPuntuacion = `puntuacion >= ${puntuacion} `
    let queryFiltros;

    //FILTROS
    if (anioInicio && genero && !puntuacion) {
        queryFiltros = `WHERE ${queryAnios} and ${queryGenero}`;

    } else if (puntuacion && genero && !anioInicio) {
        queryFiltros = `WHERE ${queryPuntuacion} and ${queryGenero}`;

    } else if (genero && !anioInicio && !puntuacion) {
        queryFiltros = `WHERE ${queryGenero}`;

    } else if (puntuacion && !genero) {
        queryFiltros = `WHERE ${queryPuntuacion}`;
        
    } else if (anioInicio && !genero) {
        queryFiltros = `WHERE ${queryAnios}`;
    }

    let queryRecomendacion = `${query} ${queryFiltros}`

    //CONEXION A LA DB
    conexion.query(queryRecomendacion, function (error, result, fields) {
        if (error) {
            console.log("error!!", error);
            throw error;
        }

        var respuesta = {
            peliculas: result
        }

        res.send(JSON.stringify(respuesta))
        console.log(respuesta)
    })

}

module.exports = {
    mostrarPeliculas: mostrarPeliculas,
    mostrarGeneros: mostrarGeneros,
    mostrarinformacion: mostrarinformacion,
    recomendarPelicula: recomendarPelicula
}
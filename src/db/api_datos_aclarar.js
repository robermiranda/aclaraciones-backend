const dbObj = require('./dbConnection')


exports.datosAclarar = function () {

    const db = dbObj.connection();

    function getQuery (query) {
        return 'SELECT dato FROM ' + query +
        ' ORDER BY dato'
    }

    function getAll(query) {
        return new Promise((resolve, reject) => {
            db.all(query, [], (err, rows) => {
                if (err) {
                    console.error('ERROR WHILE QUERING DATOS_ACLARAR', err)
                    reject('ERROR WHILE QUERING DATOS_ACLARAR: ' + query)
                }
                resolve(rows.map(x => x.dato))
            })
        })
    }

    return Promise.all([
        getAll(getQuery('datos_nacimiento')),
        getAll(getQuery('datos_matrimonio')),
        getAll(getQuery('datos_defuncion'))])
}

/*
getDatos()
.then(res => {
    console.log('------------->', res[0])
    console.log('------------->', res[1])
    console.log('------------->', res[2])
})
.catch(err => console.error(err))*/

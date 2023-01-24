import { pool } from './dbConnection';


export default function () {
    
    function getQuery (table) {
        return 'SELECT dato FROM ' + table +
        ' ORDER BY dato'
    }

    function getAll(_query) {
        return pool
            .query(_query)
            .then(res => res.rows.map(x => x.dato))
            .catch(err => err);
    }

    return Promise.all([
        getAll(getQuery('datos_nacimiento')),
        getAll(getQuery('datos_matrimonio')),
        getAll(getQuery('datos_defuncion'))])
}

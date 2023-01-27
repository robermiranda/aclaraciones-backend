"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("./dbConnection");
function default_1() {
    function getQuery(table) {
        return 'SELECT dato FROM ' + table +
            ' ORDER BY dato';
    }
    function getAll(_query) {
        return dbConnection_1.pool
            .query(_query)
            .then(res => res.rows.map(x => x.dato))
            .catch(err => err);
    }
    return Promise.all([
        getAll(getQuery('datos_nacimiento')),
        getAll(getQuery('datos_matrimonio')),
        getAll(getQuery('datos_defuncion'))
    ]);
}
exports.default = default_1;
//# sourceMappingURL=datosAclarar.js.map
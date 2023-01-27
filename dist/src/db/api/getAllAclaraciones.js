"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("./dbConnection");
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        let response;
        const aclaraciones = [];
        const queryAclaraciones = '' +
            'SELECT * FROM aclaraciones LEFT JOIN status ' +
            'ON aclaraciones.statusid = status.id ';
        const queryDatosAclarar = '' +
            'SELECT numerofolio, dato, dice, debedecir ' +
            'FROM datos_aclarar ' +
            'ORDER BY numerofolio';
        try {
            const { rows: res } = yield dbConnection_1.pool.query(queryAclaraciones);
            if (typeof res === undefined || !res)
                throw 'Sin resultados';
            res.forEach(row => {
                const promovente = {};
                const titular = {};
                const dr = {};
                const folio = {};
                promovente['nombre'] = row.promovente_nombre;
                promovente['apPaterno'] = row.promovente_appaterno;
                promovente['apMaterno'] = (0, dbConnection_1.normalizeEmptyStr)(row.promovente_apmaterno);
                promovente['email'] = row.promovente_email;
                promovente['telefono'] = (0, dbConnection_1.normalizeEmptyStr)(row.promovente_telefono);
                dr['tipoActo'] = row.dr_tipoacto;
                dr['juzgado'] = row.dr_juzgado;
                dr['libro'] = (0, dbConnection_1.normalizeEmptyStr)(row.dr_libro);
                dr['numeroActa'] = row.dr_numeroacta;
                dr['anio'] = row.dr_anio;
                dr['fechaRegistro'] = (0, dbConnection_1.normalizeEmptyStr)(row.dr_fecharegistro);
                titular['nombre'] = row.titular_nombre,
                    titular['apPaterno'] = row.titular_appaterno,
                    titular['apMaterno'] = (0, dbConnection_1.normalizeEmptyStr)(row.titular_apmaterno);
                folio['numeroFolio'] = row.numerofolio;
                folio['fechaSolicitud'] = row.fechasolicitud;
                folio['statusMsg'] = row.msg;
                aclaraciones.push({
                    titular,
                    folio,
                    promovente,
                    datosRegistrales: dr
                });
            });
            const { rows: res2 } = yield dbConnection_1.pool.query(queryDatosAclarar);
            if (typeof res2 === undefined || !res2)
                throw 'Sin datos que aclarar';
            // Datos Aclarar
            const mapDA = new Map();
            res2.forEach(row => {
                if (mapDA.has(row.numerofolio)) {
                    mapDA.get(row.numerofolio)
                        .push({
                        dato: row.dato,
                        dice: row.dice,
                        debeDecir: row.debedecir
                    });
                }
                else {
                    mapDA.set(row.numerofolio, [{
                            dato: row.dato,
                            dice: row.dice,
                            debeDecir: row.debedecir
                        }]);
                }
            });
            aclaraciones.forEach(a => {
                a['datosAclarar'] = mapDA.get(a.folio.numeroFolio);
            });
            response = {
                status: 'ok',
                data: aclaraciones
            };
        }
        catch (error) {
            console.log('ERROR AL OBTENER LAS ACLARACIONES');
            console.log(error);
            response = {
                status: 'error',
                msg: 'Error al obtener las aclaraciones'
            };
        }
        return response;
    });
}
exports.default = default_1;
//# sourceMappingURL=getAllAclaraciones.js.map
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
const util_1 = require("../../util");
function default_1(promovente, titular, datosRegistrales, datosAclarar) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = promovente;
        const t = titular;
        const dr = datosRegistrales;
        const da = datosAclarar;
        const insertAclaraciones = `INSERT INTO aclaraciones
    (numerofolio, fechasolicitud, statusid,
    promovente_nombre, promovente_appaterno, promovente_apmaterno,
    promovente_telefono, promovente_email,
    dr_tipoacto, dr_juzgado, dr_libro, dr_numeroacta, dr_anio, dr_fecharegistro,
    titular_nombre, titular_appaterno, titular_apmaterno)
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`;
        let _x = 0;
        const insertDatosAclarar = 'INSERT INTO datos_aclarar ' +
            '(numerofolio, dato, dice, debedecir) VALUES ' +
            da.map(() => `(\$${++_x}, \$${++_x}, \$${++_x}, \$${++_x})`).join(', ');
        const updateNumeroFolio = 'UPDATE numerofolio SET value = $1 WHERE id = 1';
        const STATUS_ID_SOLICITUD_REGISTRADA = 10;
        const NUMEROFOLIO_ID = 1;
        const query = `SELECT nf.value, s.msg
    FROM numerofolio nf cross join status s
    WHERE nf.id = $1 AND s.id = $2`;
        let valuesAclaraciones;
        let response;
        let client;
        try {
            client = yield dbConnection_1.pool.connect();
            yield client.query('BEGIN');
            const res = yield (0, dbConnection_1.executeQuery)(client, query, [NUMEROFOLIO_ID, STATUS_ID_SOLICITUD_REGISTRADA]);
            const valuesDatosAclarar = [];
            da.forEach(x => {
                valuesDatosAclarar.push(res.value);
                valuesDatosAclarar.push(x.dato);
                valuesDatosAclarar.push(x.dice);
                valuesDatosAclarar.push(x.debeDecir);
            });
            valuesAclaraciones = [
                res.value, (0, util_1.getDateTime)(), STATUS_ID_SOLICITUD_REGISTRADA,
                p.nombre, p.apPaterno, (p.apMaterno ? p.apMaterno : null),
                (p.telefono ? p.telefono : null), p.email,
                dr.tipoActo, dr.juzgado, (dr.libro ? dr.libro : null),
                dr.numeroActa, dr.anio, (dr.fechaRegistro ? dr.fechaRegistro : null),
                t.nombre, t.apPaterno,
                (t.apMaterno ? t.apMaterno : null)
            ];
            const nextNumeroFolio = res.value + 1;
            yield (0, dbConnection_1.executeQuery)(client, insertAclaraciones, valuesAclaraciones);
            yield (0, dbConnection_1.executeQuery)(client, insertDatosAclarar, valuesDatosAclarar);
            yield (0, dbConnection_1.executeQuery)(client, updateNumeroFolio, [nextNumeroFolio]);
            yield client.query('COMMIT');
            response = {
                status: 'ok',
                data: {
                    numeroFolio: parseInt(valuesAclaraciones[0]),
                    fechaSolicitud: valuesAclaraciones[1],
                    statusMsg: res.msg
                }
            };
        }
        catch (error) {
            console.log('ERROR AL INSERTAR LA ACLARACIÓN');
            console.error(error);
            console.log('HACIENDO ROLLBACK.');
            yield client.query('ROLLBACK');
            response = {
                status: 'error',
                msg: 'Error al insertar aclaración'
            };
        }
        finally {
            client.release();
        }
        return response;
    });
}
exports.default = default_1;
//# sourceMappingURL=insertAclaracion.js.map
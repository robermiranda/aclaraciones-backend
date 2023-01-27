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
const promovente0 = { nombre: '', apPaterno: '', email: '' };
const titular0 = { nombre: '', apPaterno: '' };
const dr0 = { tipoActo: '', juzgado: '', numeroActa: 0, anio: 0, fechaRegistro: '' };
const folio0 = { numeroFolio: 0, fechaSolicitud: '' };
function default_1(numeroFolio) {
    return __awaiter(this, void 0, void 0, function* () {
        let response;
        const promovente = promovente0;
        const titular = titular0;
        const dr = dr0;
        const folio = folio0;
        const queryAclaraciones = '' +
            'SELECT * FROM aclaraciones LEFT JOIN status ' +
            'ON aclaraciones.statusid = status.id ' +
            'WHERE aclaraciones.numerofolio = $1';
        const queryDatosAclarar = '' +
            'SELECT dato, dice, debedecir ' +
            'FROM datos_aclarar ' +
            'WHERE numerofolio = $1';
        try {
            const rows1 = yield dbConnection_1.pool.query(queryAclaraciones, [numeroFolio]);
            const res = rows1.rows[0];
            if (typeof res === undefined || !res) {
                throw numeroFolio;
            }
            promovente['nombre'] = res.promovente_nombre;
            promovente['apPaterno'] = res.promovente_appaterno;
            promovente['apMaterno'] = (0, dbConnection_1.normalizeEmptyStr)(res.promovente_apmaterno);
            promovente['email'] = res.promovente_email;
            promovente['telefono'] = (0, dbConnection_1.normalizeEmptyStr)(res.promovente_telefono);
            dr['tipoActo'] = res.dr_tipoacto;
            dr['juzgado'] = res.dr_juzgado;
            dr['libro'] = (0, dbConnection_1.normalizeEmptyStr)(res.dr_libro);
            dr['numeroActa'] = res.dr_numeroacta;
            dr['anio'] = res.dr_anio;
            dr['fechaRegistro'] = (0, dbConnection_1.normalizeEmptyStr)(res.dr_fecharegistro);
            titular["nombre"] = res.titular_nombre,
                titular["apPaterno"] = res.titular_appaterno,
                titular["apMaterno"] = (0, dbConnection_1.normalizeEmptyStr)(res.titular_apmaterno);
            folio['numeroFolio'] = res.numerofolio;
            folio['fechaSolicitud'] = res.fechasolicitud;
            folio['statusMsg'] = res.msg;
            const rows2 = yield dbConnection_1.pool.query(queryDatosAclarar, [numeroFolio]);
            const res2 = rows2.rows;
            const datosAclarar = res2.map(row => {
                return {
                    dato: row.dato,
                    dice: row.dice,
                    debeDecir: row.debedecir
                };
            });
            response = {
                status: 'ok',
                data: {
                    folio,
                    promovente,
                    titular,
                    datosRegistrales: dr,
                    datosAclarar
                }
            };
        }
        catch (error) {
            response = {
                status: 'error',
                msg: 'Error al buscar la aclaración'
            };
            if (error === numeroFolio) {
                response = {
                    status: 'warn',
                    msg: `Sin resultados para la aclaración con folio ${numeroFolio}`
                };
            }
        }
        return response;
    });
}
exports.default = default_1;
//# sourceMappingURL=getAclaracion.js.map
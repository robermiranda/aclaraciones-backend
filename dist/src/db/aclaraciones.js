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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._getAclaracion = exports._insertAclaracion = void 0;
const insertAclaracion_1 = __importDefault(require("./api/insertAclaracion"));
const getAllAclaraciones_1 = __importDefault(require("./api/getAllAclaraciones"));
const getAclaracion_1 = __importDefault(require("./api/getAclaracion"));
function validaPromovente(promovente) {
    if (!(promovente.nombre && promovente.apPaterno && promovente.email)) {
        return {
            status: "error",
            msg: 'Nombre, apellido paterno y email del promovente son obligatorios'
        };
    }
    return {
        status: "ok"
    };
}
function validaDatosRegistrales(dr) {
    if (!(dr.tipoActo &&
        dr.juzgado &&
        dr.numeroActa &&
        dr.anio)) {
        return {
            status: "error",
            msg: 'Los datos registrales: "tipo de acto", "juzgado", ' +
                '"número de acta" y "año" son OBLIGATORIOS'
        };
    }
    return {
        status: "ok"
    };
}
function validaTitular(titular) {
    if (!(titular.nombre && titular.apPaterno)) {
        return {
            status: "error",
            msg: '"Nombre" y "apellido paterno" del titular son OBLIGATORIOS'
        };
    }
    return {
        status: "ok"
    };
}
function validaDatosAclararList(da) {
    if (!(Array.isArray(da) && da.length > 0))
        return {
            status: "error",
            msg: 'array no valido'
        };
    const datoInvalido = da.find(x => !(x['dato'] && x['dice'] && x['debeDecir']));
    if (datoInvalido)
        return {
            status: "error",
            msg: 'Dato invalido: ' + datoInvalido
        };
    return {
        status: "ok"
    };
}
function _insertAclaracion(promovente, titular, datosRegistrales, datosAclarar) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(promovente &&
            titular &&
            datosRegistrales &&
            datosAclarar)) {
            return {
                status: "error",
                msg: 'Datos obligatorios: "promovente", "titular", ' +
                    '"datos registrales" y "datos a aclarar"'
            };
        }
        const statusError = [
            validaPromovente(promovente),
            validaTitular(titular),
            validaDatosRegistrales(datosRegistrales),
            validaDatosAclararList(datosAclarar)
        ].find(x => x.status === "error");
        if (statusError)
            return statusError;
        const res = yield (0, insertAclaracion_1.default)(promovente, titular, datosRegistrales, datosAclarar);
        return res;
    });
}
exports._insertAclaracion = _insertAclaracion;
function _getAclaracion(numeroFolio) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            if (numeroFolio === undefined)
                res = yield (0, getAllAclaraciones_1.default)();
            else
                res = yield (0, getAclaracion_1.default)(numeroFolio);
            return res;
        }
        catch (error) {
            return {
                status: "error",
                msg: 'Error al obtener aclaracion(es) con número de folio' + numeroFolio
            };
        }
    });
}
exports._getAclaracion = _getAclaracion;
//# sourceMappingURL=aclaraciones.js.map
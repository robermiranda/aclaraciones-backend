import insertAclaracion from './api/insertAclaracion';
import getAllAclaraciones from './api/getAllAclaraciones';
import getAclaracion from './api/getAclaracion';
import { TresponseServer,
    Tpromovente,
    Ttitular,
    TdatosRegistrales,
    TdatoAclarar } from '../types/aclaraciones';


function validaPromovente (promovente: Tpromovente): TresponseServer {

    if ( ! (promovente.nombre && promovente.apPaterno && promovente.email) ) {
        return {
            status : "error",
            msg : 'Nombre, apellido paterno y email del promovente son obligatorios'
        }
    }

    return {
        status : "ok"
    }
}

function validaDatosRegistrales (dr: TdatosRegistrales): TresponseServer {

    if ( ! ( dr.tipoActo &&
        dr.juzgado &&
        dr.numeroActa &&
        dr.anio)) {

        return {
            status : "error",
            msg : 'Los datos registrales: "tipo de acto", "juzgado", ' +
                '"número de acta" y "año" son OBLIGATORIOS'
        }
    }

    return {
        status : "ok"
    }
}

function validaTitular (titular: Ttitular): TresponseServer {

    if ( ! ( titular.nombre && titular.apPaterno)) {

        return {
            status : "error",
            msg : '"Nombre" y "apellido paterno" del titular son OBLIGATORIOS'
        }
    }

    return {
        status : "ok"
    }
}

function validaDatosAclararList (da: Array<TdatoAclarar>): TresponseServer {
    
    if ( ! (Array.isArray(da) && da.length > 0)) return {
        status : "error",
        msg : 'array no valido'
    }

    const datoInvalido = da.find(x => !(x['dato'] && x['dice'] && x['debeDecir']));

    if (datoInvalido) return {
        status : "error",
        msg : 'Dato invalido: ' + datoInvalido
    }

    return {
        status : "ok"
    }
}

export async function _insertAclaracion (promovente: Tpromovente,
    titular: Ttitular,
    datosRegistrales: TdatosRegistrales,
    datosAclarar: Array<TdatoAclarar>): Promise<TresponseServer> {
    
    if ( ! ( promovente &&
        titular &&
        datosRegistrales &&
        datosAclarar)) {

        return {
            status : "error",
            msg : 'Datos obligatorios: "promovente", "titular", ' +
                '"datos registrales" y "datos a aclarar"'
        };
    }

    const statusError: TresponseServer = [
        validaPromovente(promovente),
        validaTitular(titular),
        validaDatosRegistrales(datosRegistrales),
        validaDatosAclararList(datosAclarar)
    ].find(x => x.status === "error");

    if (statusError) return statusError;

    const res = await insertAclaracion(promovente, titular, datosRegistrales, datosAclarar)

    return res
}


export async function _getAclaracion (numeroFolio: undefined | number): Promise<TresponseServer> {

    let res: any;

    try {
        if (numeroFolio === undefined) res = await getAllAclaraciones();
        else res = await getAclaracion(numeroFolio);
        return res
    }
    catch(error) {
        return {
            status : "error",
            msg : 'Error al obtener aclaracion(es) con número de folio' + numeroFolio
        }
    }
}

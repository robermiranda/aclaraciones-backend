import { normalizeEmptyStr, pool } from './dbConnection';
import { Tpromovente,
    Ttitular,
    TdatosRegistrales,
    TdatoAclarar, 
    Tfolio,
    TaclaracionResponse } from '../../types/aclaraciones';

const promovente0: Tpromovente = {nombre:'', apPaterno:'', email:''}
const titular0: Ttitular = {nombre:'', apPaterno:''}
const dr0: TdatosRegistrales = {tipoActo:'', juzgado:'', numeroActa:0, anio:0, fechaRegistro:''}
const folio0: Tfolio = {numeroFolio: 0, fechaSolicitud: ''}

export default async function (numeroFolio: number): Promise<TaclaracionResponse> {

    let response: TaclaracionResponse;

    const promovente: Tpromovente = promovente0
    const titular: Ttitular = titular0
    const dr: TdatosRegistrales = dr0
    const folio: Tfolio = folio0

    const queryAclaraciones = '' +
        'SELECT * FROM aclaraciones LEFT JOIN status ' +
        'ON aclaraciones.statusid = status.id ' +
        'WHERE aclaraciones.numerofolio = $1';

    const queryDatosAclarar = '' +
        'SELECT dato, dice, debedecir ' +
        'FROM datos_aclarar ' +
        'WHERE numerofolio = $1';

    try {
        const rows1 = await pool.query(queryAclaraciones, [numeroFolio]);

        const res = rows1.rows[0];

        if (typeof res === undefined || ! res) {
            throw numeroFolio;
        }

        promovente['nombre'] = res.promovente_nombre;
        promovente['apPaterno'] = res.promovente_appaterno;
        promovente['apMaterno'] = normalizeEmptyStr(res.promovente_apmaterno);
        promovente['email'] = res.promovente_email;
        promovente['telefono'] = normalizeEmptyStr(res.promovente_telefono);

        dr['tipoActo'] = res.dr_tipoacto;
        dr['juzgado'] = res.dr_juzgado;
        dr['libro'] = normalizeEmptyStr(res.dr_libro);
        dr['numeroActa'] = res.dr_numeroacta;
        dr['anio'] = res.dr_anio;
        dr['fechaRegistro'] = normalizeEmptyStr(res.dr_fecharegistro);

        titular["nombre"] = res.titular_nombre,
        titular["apPaterno"] = res.titular_appaterno,
        titular["apMaterno"] = normalizeEmptyStr(res.titular_apmaterno)
        
        folio['numeroFolio'] = res.numerofolio;
        folio['fechaSolicitud'] = res.fechasolicitud;
        folio['statusMsg'] = res.msg;

        const rows2 = await pool.query(queryDatosAclarar, [numeroFolio]);

        const res2 = rows2.rows;

        const datosAclarar: Array<TdatoAclarar> = res2.map(row => {
            return {
                dato : row.dato,
                dice : row.dice,
                debeDecir : row.debedecir
            }
        });
    
        response = {
            status: 'ok',
            data: {
                folio,
                promovente,
                titular,
                datosRegistrales : dr,
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
            }
        }
    }
    
    return response;
}

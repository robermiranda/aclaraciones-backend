import { normalizeEmptyStr, pool } from './dbConnection';
import { TaclaracionResponse } from '../../types/aclaraciones';


export default async function (): Promise<TaclaracionResponse> {

    let response: TaclaracionResponse;

    const aclaraciones = [];

    const queryAclaraciones = '' +
        'SELECT * FROM aclaraciones LEFT JOIN status ' +
        'ON aclaraciones.statusid = status.id '; 

    const queryDatosAclarar = '' +
        'SELECT numerofolio, dato, dice, debedecir ' +
        'FROM datos_aclarar ' +
        'ORDER BY numerofolio';

    try {

        const { rows: res } = await pool.query(queryAclaraciones);

        if (typeof res === undefined || ! res) throw 'Sin resultados';

        res.forEach(row => {

            const promovente = {}
            const titular = {}
            const dr = {}
            const folio = {}

            promovente['nombre'] = row.promovente_nombre;
            promovente['apPaterno'] = row.promovente_appaterno;
            promovente['apMaterno'] = normalizeEmptyStr(row.promovente_apmaterno);
            promovente['email'] = row.promovente_email;
            promovente['telefono'] = normalizeEmptyStr(row.promovente_telefono);
            
            dr['tipoActo'] = row.dr_tipoacto;
            dr['juzgado'] = row.dr_juzgado;
            dr['libro'] = normalizeEmptyStr(row.dr_libro);
            dr['numeroActa'] = row.dr_numeroacta;
            dr['anio'] = row.dr_anio;
            dr['fechaRegistro'] = normalizeEmptyStr(row.dr_fecharegistro);
            
            titular['nombre'] = row.titular_nombre,
            titular['apPaterno'] = row.titular_appaterno,
            titular['apMaterno'] = normalizeEmptyStr(row.titular_apmaterno)
            
            folio['numeroFolio'] = row.numerofolio;
            folio['fechaSolicitud'] = row.fechasolicitud;
            folio['statusMsg'] = row.msg;

            aclaraciones.push({
                titular,
                folio,
                promovente,
                datosRegistrales : dr
            });
        });

        const { rows: res2 } = await pool.query(queryDatosAclarar);

        if (typeof res2 === undefined || ! res2) throw 'Sin datos que aclarar';

        // Datos Aclarar
        const mapDA = new Map();

        res2.forEach(row => {
            if (mapDA.has(row.numerofolio)) {
                mapDA.get(row.numerofolio)
                .push({
                    dato : row.dato,
                    dice : row.dice,
                    debeDecir : row.debedecir
                });
            }
            else {
                mapDA.set(row.numerofolio, [{
                    dato : row.dato,
                    dice : row.dice,
                    debeDecir : row.debedecir
                }]);
            }
        });

        aclaraciones.forEach(a => {
            a['datosAclarar'] = mapDA.get(a.folio.numeroFolio);
        });

        response = {
            status: 'ok',
            data: aclaraciones
        }
    }
    catch(error) {
        console.log('ERROR AL OBTENER LAS ACLARACIONES');
        console.log(error);
        response = {
            status: 'error',
            msg: 'Error al obtener las aclaraciones'
        }
    }

    return response;
}

import { executeQuery, pool } from './dbConnection';
import { getDateTime } from '../../util';
import { TresponseServer,
    Tpromovente,
    Ttitular,
    TdatosRegistrales,
    TdatoAclarar } from '../../types/aclaraciones';


export default async function (promovente: Tpromovente,
    titular: Ttitular,
    datosRegistrales: TdatosRegistrales,
    datosAclarar: Array<TdatoAclarar>): Promise<TresponseServer> {

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

    const updateNumeroFolio: string = 'UPDATE numerofolio SET value = $1 WHERE id = 1';
    
    const STATUS_ID_SOLICITUD_REGISTRADA = 10;
    const NUMEROFOLIO_ID = 1;
    
    const query = `SELECT nf.value, s.msg
    FROM numerofolio nf cross join status s
    WHERE nf.id = $1 AND s.id = $2`;

    let valuesAclaraciones: Array<string>;

    let response: TresponseServer;

    let client;

    try {

        client = await pool.connect();

        await client.query('BEGIN');

        const res = await executeQuery(client, query, [NUMEROFOLIO_ID, STATUS_ID_SOLICITUD_REGISTRADA]);

        const valuesDatosAclarar = [];
        da.forEach(x => {
            valuesDatosAclarar.push(res.value);
            valuesDatosAclarar.push(x.dato);
            valuesDatosAclarar.push(x.dice);
            valuesDatosAclarar.push(x.debeDecir);
        });

        valuesAclaraciones = [
            res.value, getDateTime(), STATUS_ID_SOLICITUD_REGISTRADA,
            p.nombre, p.apPaterno, (p.apMaterno ? p.apMaterno : null),
            (p.telefono ? p.telefono : null), p.email,
            dr.tipoActo, dr.juzgado, (dr.libro ? dr.libro : null),
            dr.numeroActa, dr.anio, (dr.fechaRegistro ? dr.fechaRegistro : null),
            t.nombre, t.apPaterno,
            (t.apMaterno ? t.apMaterno : null)
        ];

        const nextNumeroFolio = res.value + 1;

        await executeQuery(client, insertAclaraciones, valuesAclaraciones);

        await executeQuery(client, insertDatosAclarar, valuesDatosAclarar);

        await executeQuery(client, updateNumeroFolio, [nextNumeroFolio]);

        await client.query('COMMIT');
        
        response = {
            status: 'ok',
            data: {
                numeroFolio : parseInt(valuesAclaraciones[0]),
                fechaSolicitud : valuesAclaraciones[1],
                statusMsg : res.msg
            }
        };
    }
    catch (error) {
        console.log('ERROR AL INSERTAR LA ACLARACIÓN');
        console.error(error);
        console.log('HACIENDO ROLLBACK.');
        await client.query('ROLLBACK');
        response = {
            status: 'error',
            msg: 'Error al insertar aclaración'
        };
    }
    finally {
        client.release();
    }
    
    return response;
}

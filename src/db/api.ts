import { getDateTime } from '../util';
import { TresponseServer,
    Tpromovente,
    Ttitular,
    TdatosRegistrales,
    TdatoAclarar, 
    Tfolio,
    TaclaracionResponse } from '../types/aclaraciones';

const dbObj = require('./dbConnection')

const promovente0: Tpromovente = {nombre:'', apPaterno:'', email:''}
const titular0: Ttitular = {nombre:'', apPaterno:''}
const dr0: TdatosRegistrales = {tipoActo:'', juzgado:'', numeroActa:0, anio:0, fechaRegistro:''}
const folio0: Tfolio = {numeroFolio: 0, fechaSolicitud: ''}

export function insertAclaracion (promovente: Tpromovente,
    titular: Ttitular,
    datosRegistrales: TdatosRegistrales,
    datosAclarar: Array<TdatoAclarar>): Promise<TresponseServer> {

    const db = dbObj.connection()

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
	values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const insertDatosAclarar = 'INSERT INTO datosaclarar ' +
    '(numerofolio, dato, dice, debedecir) VALUES ' +
    da.map(() => '(?, ?, ?, ?)').join(', ');

    const updateNumeroFolio = 'UPDATE numerofolio SET value = ? WHERE id = 1';

    return new Promise ((resolve, reject) => {

            const STATUS_ID_SOLICITUD_REGISTRADA = 10;
            const NUMEROFOLIO_ID = 1;
            
            const query = `SELECT nf.value, s.msg
            FROM numerofolio nf cross join status s
            WHERE nf.id = ? AND s.id = ?`;

            db.get(query, [NUMEROFOLIO_ID, STATUS_ID_SOLICITUD_REGISTRADA], (err, row) => {

            if (err) {
                console.log('ERROR WHILE GETTING NUMERO DE FOLIO', err);
                reject(err);
            }

            const valuesDatosAclarar = [];
            da.forEach(x => {
                valuesDatosAclarar.push(row.value);
                valuesDatosAclarar.push(x.dato);
                valuesDatosAclarar.push(x.dice);
                valuesDatosAclarar.push(x.debeDecir);
            });

            const valuesAclaraciones = [
                row.value, getDateTime(), STATUS_ID_SOLICITUD_REGISTRADA,
                p.nombre, p.apPaterno, (p.apMaterno ? p.apMaterno : null),
                (p.telefono ? p.telefono : null), p.email,
                dr.tipoActo, dr.juzgado, (dr.libro ? dr.libro : null),
                dr.numeroActa, dr.anio, (dr.fechaRegistro ? dr.fechaRegistro : null),
                t.nombre, t.apPaterno,
                (t.apMaterno ? t.apMaterno : null)
            ];

            const nextNumeroFolio = row.value + 1;

            db.serialize(() => {

                db.run(insertAclaraciones, valuesAclaraciones, err => {
                    if (err) {
                        console.log('ERROR WHILE INSERT ACLARACIONES', err);
                        reject({
                            status: 'error',
                            msg: 'ERROR WHILE INSERT ACLARACIONES'
                        })
                    }
                })
                .run(insertDatosAclarar, valuesDatosAclarar, err => {
                    if (err) {
                        console.log('ERROR WHILE INSERT DATOS_ACLARAR', err);
                        reject({
                            status: 'error',
                            msg: 'ERROR WHILE INSERT DATOS_ACLARAR'
                        })
                    }
                })
                .run(updateNumeroFolio, [nextNumeroFolio], err => {
                    if (err) {
                        console.log('ERROR WHILE UPDATING NUMERO DE FOLIO', err);
                        reject({
                            status: 'error',
                            msg: 'ERROR WHILE UPDATING NUMERO DE FOLIO'
                        });
                    }
    
                    resolve({
                        status: 'ok',
                        data: {
                            numeroFolio : valuesAclaraciones[0],
                            fechaSolicitud : valuesAclaraciones[1],
                            statusMsg : row.msg
                        }
                    });
                })
                .close(err => {
                    if (err) console.log('ERROR WHILE CLOSE DB.', err);
                    console.log('CLOSE CONNECTION OK FROM INSERT ACLARACION');
                });
            });
        })
    });
}


export function getAclaracion (numeroFolio: number): Promise<TaclaracionResponse> {

    const db = dbObj.connection()

    const promovente: Tpromovente = promovente0
    const titular: Ttitular = titular0
    const dr: TdatosRegistrales = dr0
    const folio: Tfolio = folio0

    const queryAclaraciones = '' +
        'SELECT * FROM aclaraciones LEFT JOIN status ' +
        'ON aclaraciones.statusid = status.id ' +
        'WHERE aclaraciones.numerofolio = ?';

    const queryDatosAclarar = '' +
        'SELECT dato, dice, debedecir ' +
        'FROM datosaclarar ' +
        'WHERE numerofolio = ?';

    return new Promise ((resolve, reject) => {

        db.serialize( () => {
            db.get(queryAclaraciones, [numeroFolio], (err, row) => {
                if (err) {
                    console.log('ERROR WHILE QUERING ACLARACIONES WITH NUMERO FOLIO', numeroFolio, err);
                    reject({
                        status: 'error',
                        msg: 'ERROR WHILE QUERING ACLARACIONES WITH NUMERO FOLIO ' + numeroFolio
                    });
                }
                
                if (typeof row === undefined || ! row) resolve({
                    status: 'warn',
                    data: null
                })
                else {
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

                    titular["nombre"] = row.titular_nombre,
                    titular["apPaterno"] = row.titular_appaterno,
                    titular["apMaterno"] = normalizeEmptyStr(row.titular_apmaterno)
                    
                    folio['numeroFolio'] = row.numerofolio;
                    folio['fechaSolicitud'] = row.fechasolicitud;
                    folio['statusMsg'] = row.msg;
                }
            })
            .all(queryDatosAclarar, [numeroFolio], (err, rows) => {
                if (err) {
                    console.log('ERROR WHILE QUERING DATOS ACLARAR WITH NUMERO FOLIO', numeroFolio, err);
                    reject({
                        status: 'error',
                        msg: 'ERROR WHILE QUERING DATOS ACLARAR WITH NUMERO FOLIO ' + numeroFolio
                    });
                }
                
                const datosAclarar: Array<TdatoAclarar> = rows.map(row => {
                    return {
                        dato : row.dato,
                        dice : row.dice,
                        debeDecir : row.debedecir
                    }
                });

                resolve({
                    status: 'ok',
                    data: {
                        folio,
                        promovente,
                        titular,
                        datosRegistrales : dr,
                        datosAclarar
                    }
                });
            })
            .close(err => {
                if (err) console.log('ERROR WHILE CLOSE DB.', err);
                console.log('CLOSE CONNECTION OK FROM GET ACLARACION');
            });
        });
    });
}


export function getAllAclaraciones (): Promise<TaclaracionResponse> {

    const db = dbObj.connection()

    const aclaraciones = [];

    const queryAclaraciones = '' +
        'SELECT * FROM aclaraciones LEFT JOIN status ' +
        'ON aclaraciones.statusid = status.id '; 

    const queryDatosAclarar = '' +
        'SELECT numerofolio, dato, dice, debedecir ' +
        'FROM datosaclarar ' +
        'ORDER BY numerofolio';

    return new Promise ((resolve, reject) => {

        db.serialize( () => {
            db.all(queryAclaraciones, [], (err, rows) => {
                if (err) {
                    console.log('ERROR WHILE QUERING ALL ACLARACIONES', err);
                    reject({
                        status: 'error',
                        msg: 'ERROR WHILE QUERING ALL ACLARACIONES'
                    });
                }
                
                if (typeof rows === undefined || ! rows) resolve({
                    status: 'warn',
                    data: null
                });
                else rows.forEach(row => {

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
            })
            .all(queryDatosAclarar, [], (err, rows) => {
                if (err) {
                    console.log('ERROR WHILE QUERING ALL DATOS ACLARAR', err);
                    reject({
                        status: 'error',
                        msg: 'ERROR WHILE QUERING ALL DATOS ACLARAR'
                    })
                }
                
                // Datos Aclarar
                const mapDA = new Map();

                rows.forEach(row => {
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
                
                resolve({
                    status: 'ok',
                    data: aclaraciones
                });
            })
            .close(err => {
                if (err) console.log('ERROR WHILE CLOSE DB.', err);
                console.log('CLOSE CONNECTION OK FROM GET ALL ACLARACIONES');
            });
        });
    });
}

const normalizeEmptyStr = x => x ? x : '';

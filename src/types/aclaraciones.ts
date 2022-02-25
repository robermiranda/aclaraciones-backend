export type Tpromovente = {
    nombre: string;
    apPaterno: string;
    apMaterno?: string;
    telefono?: string;
    email: string;
}

export type Ttitular = {
    nombre: string;
    apPaterno: string;
    apMaterno?: string;
}

export type TdatosRegistrales = {
    tipoActo: string;
    juzgado: string | number;
    libro?: number;
    numeroActa: number;
    anio: number;
    fechaRegistro?: string
}

export type TdatoAclarar = {
    id: number;
    dato: string;
    dice: string;
    debeDecir: string;
}


type Tmes = 'Enero' | 'Febrero' | 'Marzo' | 'Abril' | 'Mayo' | 'Junio' |
    'Julio' | 'Agosto' | 'Septiembre' | 'Octubre' | 'Noviembre' | 'Diciembre'

export type Tfecha = {
    dia: number;
    mes: Tmes;
    anio: number;
}

export type Tfolio = {
    numeroFolio: number;
    fechaSolicitud: string;
    statusMsg?: string; 
}

type Tstatus = 'ok' | 'warn' | 'error'


export type TresponseServer = {
    status: Tstatus;
    data?: Tfolio;
    msg?: string
}


export type Taclaracion_folio = {
    promovente: Tpromovente;
    titular: Ttitular;
    datosRegistrales: TdatosRegistrales;
    datosAclarar: Array<TdatoAclarar>;
    folio: Tfolio;
}

export type TaclaracionResponse = {
    status: Tstatus;
    data?: Taclaracion_folio | Array<Taclaracion_folio>;
    msg?: string;
}

CREATE TABLE IF NOT EXISTS numerofolio (id INTEGER UNIQUE NOT NULL, value INTEGER UNIQUE NOT NULL);

CREATE TABLE IF NOT EXISTS status (id INTEGER UNIQUE NOT NULL, msg VARCHAR(50) NOT NULL);

CREATE TABLE IF NOT EXISTS aclaraciones (
	numerofolio INTEGER PRIMARY KEY,
	fechasolicitud VARCHAR(20) NOT NULL,
	statusid INTEGER NOT NULL,
	
	promovente_nombre VARCHAR(50) NOT NULL,
	promovente_appaterno VARCHAR(50) NOT NULL,
	promovente_apmaterno VARCHAR(50),
	promovente_telefono VARCHAR(15),
	promovente_email VARCHAR(50),
	
    dr_tipoacto VARCHAR(30) NOT NULL,
	dr_juzgado INTEGER NOT NULL,
	dr_libro INTEGER DEFAULT 0,
	dr_numeroacta INTEGER NOT NULL,
	dr_anio INTEGER NOT NULL,
	dr_fecharegistro VARCHAR(30),

	titular_nombre VARCHAR(50) NOT NULL,
	titular_appaterno VARCHAR(50) NOT NULL,
	titular_apmaterno VARCHAR(50),
	
	FOREIGN KEY (statusid) REFERENCES status(id));


CREATE TABLE IF NOT EXISTS datos_aclarar (
	numerofolio INTEGER NOT NULL,
	dato VARCHAR(50) NOT NULL,
	dice VARCHAR(250),
	debedecir VARCHAR(250),
	
	FOREIGN KEY (numerofolio) REFERENCES aclaraciones(numerofolio));



INSERT INTO numerofolio (id, value) VALUES (1, 1);


INSERT INTO status (id, msg) VALUES (10, 'solicitud registrada');


INSERT INTO status (id, msg) VALUES (20, 'solicitud en revisión');


INSERT INTO status (id, msg) VALUES (30, 'aclaración aprovada');


INSERT INTO status (id, msg) VALUES (40, 'aclaración no aprovada');

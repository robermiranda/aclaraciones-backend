CREATE TABLE IF NOT EXISTS aclaraciones (
	numerofolio INTEGER PRIMARY KEY ASC,
	fechasolicitud TEXT NOT NULL,
	statusid INTEGER NOT NULL,
	
	promovente_nombre TEXT NOT NULL,
	promovente_appaterno TEXT NOT NULL,
	promovente_apmaterno TEXT,
	promovente_telefono TEXT,
	promovente_email TEXT,
	
    dr_tipoacto TEXT NOT NULL,
	dr_juzgado INTEGER NOT NULL,
	dr_libro INTEGER,
	dr_numeroacta INTEGER NOT NULL,
	dr_anio INTEGER NOT NULL,
	dr_fecharegistro TEXT,

	titular_nombre TEXT NOT NULL,
	titular_appaterno TEXT NOT NULL,
	titular_apmaterno TEXT,
	
	FOREIGN KEY (statusid) REFERENCES status(id));


CREATE TABLE IF NOT EXISTS datosaclarar (
	numerofolio INTEGER NOT NULL,
	dato TEXT NOT NULL,
	dice TEXT,
	debedecir TEXT,
	
	FOREIGN KEY (numerofolio) REFERENCES aclaraciones(numerofolio));


CREATE TABLE IF NOT EXISTS status (id INTEGER UNIQUE NOT NULL, msg TEXT NOT NULL);


CREATE TABLE IF NOT EXISTS numerofolio (id INTEGER UNIQUE NOT NULL, value INTEGER UNIQUE NOT NULL);


INSERT INTO numerofolio (id, value) VALUES (1, 1);


INSERT INTO status (id, msg) VALUES (10, "solicitud registrada");


INSERT INTO status (id, msg) VALUES (20, "solicitud en revisión");


INSERT INTO status (id, msg) VALUES (30, "aclaración aprovada");


INSERT INTO status (id, msg) VALUES (40, "aclaración no aprovada");


# Ways executing this file.
# sqlite3 Test.db < tables.sql
# cat tables.sql | sqlite3 Test.db
# .read tables.sql
# sqlite3 Test.db ".read tables.sql"
# sqlite3 Test.db -init tables.sql

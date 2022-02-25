const sqlite = require('sqlite3').verbose();
const path = require('path');

exports.connection = function () {
    let url = path.resolve('./src/db/aclaraciones.db');
    if (process.env.NODE_ENV === 'production') url = '/app/db/aclaraciones.db';
    return new sqlite.Database(url, err => {
	    if (err) console.log('ERROR WHILE CONNECTING DB.', err);
	    else console.log('OPEN CONNECTION OK.');
    });
}
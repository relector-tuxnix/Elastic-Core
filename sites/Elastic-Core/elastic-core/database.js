
var sqlite3 = require('sqlite3').verbose()

var $ = module.exports;

$.conn = new sqlite3.Database(`./databases/${CONF['default_database']}`, sqlite3.OPEN_READWRITE, (err) => {

	if(err) {
		console.error(err.message);
	}

	console.log('Connected to the database.');
});


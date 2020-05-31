var mysql = require('mysql');
const CONFIG = require('../configuration/config');

var database = mysql.createConnection({
    host: CONFIG.Database.hostName,
    user: CONFIG.Database.userName,
    password: CONFIG.Database.passWord,
    database: CONFIG.Database.databaseName
});

database.connect(function(err) {
	if (err){
		console.log("\nDatabase Connection Error");
		throw err;
	}
	else
		console.log("\nDatabase Connected!.....");
});

module.exports = database;
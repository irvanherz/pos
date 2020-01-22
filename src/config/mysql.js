const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",
	user:  "root",
	password: "",
	database: "pos"
});

connection.connect((error) => {
	if(error) throw error;
	console.log("Connected!")
});

module.exports = connection

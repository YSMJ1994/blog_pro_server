const mysql = require('mysql');
const pool = mysql.createPool({
	connectionLimit: process.env.mysql_connection,
	host: process.env.mysql_host,
	user: process.env.mysql_username,
	password: process.env.mysql_password,
	database: process.env.mysql_database
});

function executeSql(sql, values) {
	return new Promise((resolve, reject) => {
		pool.query(sql, values, (err, results, fields) => {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
}

function escape(value) {
	return pool.escape(value)
}

module.exports = {
	executeSql,
	escape
};

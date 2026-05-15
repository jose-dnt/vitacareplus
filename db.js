const mysql = require('mysql2');

const connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'projeto'
});

connection.connect((error) => {
	if(error){
		console.error('Error conectando o MySQL:', error);
		return;
	}
	console.log('Banco de dados MySQL conectado!');
});

module.exports = connection;

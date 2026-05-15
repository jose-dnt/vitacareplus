const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: ''
});

connection.query(`
    CREATE DATABASE IF NOT EXISTS projeto
`, (err) => {

	if (err) {
		console.error('Erro criando database:', err);
		return;
	}

	console.log('Database OK');

	connection.changeUser({ database: 'projeto' }, (err) => {

		if (err) {
			console.error('Erro selecionando database:', err);
			return;
		}

		console.log('Usando database projeto');

		criarTabelas();
	});
});

function criarTabelas() {

	connection.query(`
        CREATE TABLE IF NOT EXISTS pacientes (
            id VARCHAR(36) PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            cpf VARCHAR(14) NOT NULL UNIQUE,
            data_nascimento DATE NOT NULL,
            telefone VARCHAR(20),
            email VARCHAR(100),
            endereco VARCHAR(255)
        )
    `);

	connection.query(`
        CREATE TABLE IF NOT EXISTS profissionais (
            id VARCHAR(36) PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            crm VARCHAR(20) NOT NULL UNIQUE,
            especialidade VARCHAR(100) NOT NULL,
            telefone VARCHAR(20),
            email VARCHAR(100)
        )
    `);

	connection.query(`
        CREATE TABLE IF NOT EXISTS consultas (
            id VARCHAR(36) PRIMARY KEY,
            paciente_id VARCHAR(36) NOT NULL,
            profissional_id VARCHAR(36) NOT NULL,
            data DATE NOT NULL,
            horario TIME NOT NULL,
            status ENUM('agendada', 'realizada', 'cancelada') DEFAULT 'agendada',
            observacoes TEXT,

            FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
            FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
        )
    `);

	connection.query(`
        CREATE TABLE IF NOT EXISTS historico_medico (
            id VARCHAR(36) PRIMARY KEY,
            consulta_id VARCHAR(36) NOT NULL,
            diagnostico TEXT,
            prescricao TEXT,
            observacoes TEXT,

            FOREIGN KEY (consulta_id) REFERENCES consultas(id)
        )
    `);

	connection.query(`
        CREATE TABLE IF NOT EXISTS disponibilidade (
            id VARCHAR(36) PRIMARY KEY,
            profissional_id VARCHAR(36) NOT NULL,

            dia_semana ENUM(
                'domingo',
                'segunda',
                'terca',
                'quarta',
                'quinta',
                'sexta',
                'sabado'
            ),

            hora_inicio TIME NOT NULL,
            hora_fim TIME NOT NULL,

            FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
        )
    `);

	connection.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id VARCHAR(36) PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL
        )
    `);

	console.log('Tabelas criadas');

	inserirDados();
}

function inserirDados() {

	connection.query(`
        INSERT IGNORE INTO pacientes
        (id, nome, cpf, data_nascimento, telefone, email, endereco)
        VALUES
        (UUID(), 'João Silva', '12345678900', '1990-05-10', '82999999999', 'joao@gmail.com', 'Rua A'),
        (UUID(), 'Maria Souza', '98765432100', '1985-08-22', '82988888888', 'maria@gmail.com', 'Rua B')
    `);

	connection.query(`
        INSERT IGNORE INTO profissionais
        (id, nome, crm, especialidade, telefone, email)
        VALUES
        (UUID(), 'Dr. Carlos', 'CRM123', 'Cardiologia', '82911111111', 'carlos@clinica.com'),
        (UUID(), 'Dra. Ana', 'CRM456', 'Pediatria', '82922222222', 'ana@clinica.com')
    `);

	console.log('Dados inseridos');
};

module.exports = connection;
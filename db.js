import mysql from 'mysql2/promise';
import crypto from 'crypto';

let connection = null;

export async function conectarBanco() {
    if (connection) return connection;

    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        await connection.query('CREATE DATABASE IF NOT EXISTS projeto');
        console.log('Database OK');

        await connection.query('USE projeto');
        console.log('Usando database projeto');

        await criarTabelas();
        await inserirDados();

        return connection;
    } catch (error) {
        console.error('Erro crítico na inicialização do banco:', error);
        throw error;
    }
}

async function criarTabelas() {
    await connection.query(`
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

    await connection.query(`
        CREATE TABLE IF NOT EXISTS profissionais (
            id VARCHAR(36) PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            crm VARCHAR(20) NOT NULL UNIQUE,
            especialidade VARCHAR(100) NOT NULL,
            telefone VARCHAR(20),
            email VARCHAR(100)
        )
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS consultas (
            id VARCHAR(36) PRIMARY KEY,
            paciente_id VARCHAR(36) NOT NULL,
            profissional_id VARCHAR(36) NOT NULL,
            data DATE NOT NULL,
            horario TIME NOT NULL,
            status ENUM('agendada', 'realizada', 'cancelada') DEFAULT 'agendada',
            diagnostico TEXT,
            prescricao TEXT,
            observacoes TEXT,
            FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
            FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
        )
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS disponibilidade (
            id VARCHAR(36) PRIMARY KEY,
            profissional_id VARCHAR(36) NOT NULL,
            dia_semana ENUM('domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'),
            hora_inicio TIME NOT NULL,
            hora_fim TIME NOT NULL,
            FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
        )
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id VARCHAR(36) PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL
        )
    `);

    console.log('Tabelas criadas');
}

async function inserirDados() {
    const paciente1 = '82cb25f8-e103-4859-a2a8-4ba913ee4bd5';
    const paciente2 = '008c9093-61be-463f-bc4f-c505f1cfbe76';

    const profissional1 = 'c3c409e1-1a65-4b69-915b-ab5a807b9ef1';
    const profissional2 = '293dc3f1-87c6-4bc2-973e-39aaf959edaf';

    const consulta1 = '55294fc0-77d0-4e32-bf51-076df5610737';
    const consulta2 = '66fcf44e-07c4-4ca5-8aab-212f0fff842f';

    await connection.query(`
        INSERT IGNORE INTO pacientes
        (id, nome, cpf, data_nascimento, telefone, email, endereco)
        VALUES
        (?, 'João Silva', '12345678900', '1990-05-10', '82999999999', 'joao@gmail.com', 'Rua A'),
        (?, 'Maria Souza', '98765432100', '1985-08-22', '82988888888', 'maria@gmail.com', 'Rua B')
    `, [paciente1, paciente2]);

    await connection.query(`
        INSERT IGNORE INTO profissionais
        (id, nome, crm, especialidade, telefone, email)
        VALUES
        (?, 'Dr. Carlos', 'CRM123', 'Cardiologia', '82911111111', 'carlos@clinica.com'),
        (?, 'Dra. Ana', 'CRM456', 'Pediatria', '82922222222', 'ana@clinica.com')
    `, [profissional1, profissional2]);

    await connection.query(`
        INSERT IGNORE INTO consultas
        (
            id,
            paciente_id,
            profissional_id,
            data,
            horario,
            status,
            diagnostico,
            prescricao,
            observacoes
        )
        VALUES
        (
            ?,
            ?,
            ?,
            '2025-06-15',
            '09:00:00',
            'agendada',
            NULL,
            NULL,
            'Primeira consulta'
        ),
        (
            ?,
            ?,
            ?,
            '2025-06-16',
            '14:30:00',
            'realizada',
            'Hipertensão leve',
            'Monitorar pressão arterial',
            'Retorno em 30 dias'
        )
    `, [
        consulta1,
        paciente1,
        profissional1,

        consulta2,
        paciente2,
        profissional2
    ]);

    console.log('Dados inseridos');
}
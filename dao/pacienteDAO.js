import PacienteModel from '../models/pacienteModel.js';

export default class PacienteDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchAll(queryData) {

        const { start, length, search } = queryData;
        const search_value = search.value;

        const search_query = search_value ? ` WHERE nome LIKE '%${search_value}%' OR cpf LIKE '%${search_value}%' OR telefone LIKE '%${search_value}%' OR email LIKE '%${search_value}%' OR endereco LIKE '%${search_value}%'` : '';

        const query = `SELECT id, nome, cpf, data_nascimento, telefone, email, endereco FROM pacientes ${search_query} LIMIT ${start}, ${length}`;

        try {

            const [rows] = await this.connection.query(query)

            const pacientes = rows.map((data) => {
                return PacienteModel.constructFromObject(data)
            })

            return pacientes;
        } catch (err) {
            console.log(err)
        }

    }

    async submitData(data) {

        const { action, ...pacienteData } = data;
        const paciente = PacienteModel.constructFromObject(pacienteData)

        let query;
        let queryData;
        let message;

        if (action === 'Insert') {
            query = `INSERT INTO pacientes (id, nome, cpf, data_nascimento, telefone, email, endereco) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            queryData = [paciente.id, paciente.nome, paciente.cpf, paciente.data_nascimento, paciente.telefone, paciente.email, paciente.endereco];
            message = 'Dados foi inserido!';
        } else if (action === 'Edit') {
            query = `UPDATE pacientes SET nome = ?, cpf = ?, data_nascimento = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?`;
            queryData = [paciente.nome, paciente.cpf, paciente.data_nascimento, paciente.telefone, paciente.email, paciente.endereco];
            message = 'Dados atualizados!';
        } else if (action === 'Delete') {
            query = `DELETE FROM pacientes WHERE id = ?`;
            queryData = [paciente.id];
            message = 'Deletado!';
        } else {
            throw new Error('Ação inválida!');
        }

        try {
            await this.connection.query(query, queryData);
            return message;
        } catch (err) {
            console.log(err)
        }
    }

    static async fetchSingle(id) {
        const query = `SELECT * FROM pacientes WHERE id = ?`;

        try {
            const [rows] = await this.connection.query(query, [id]);
            const paciente = PacienteModel.constructFromObject(rows[0]);
            return paciente;
        } catch (err) {
            console.log(err)
        }
    }
}

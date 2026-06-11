import crypto from 'crypto';

export default class PacienteDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchAll(queryData) {

        const { start, length, search } = queryData;
        const search_value = search?.value || "";

        const search_query = search_value ? ` WHERE nome LIKE '%${search_value}%' OR cpf LIKE '%${search_value}%' OR telefone LIKE '%${search_value}%' OR email LIKE '%${search_value}%' OR endereco LIKE '%${search_value}%'` : '';

        let query = `SELECT id, nome, cpf, data_nascimento, telefone, email, endereco FROM pacientes ${search_query}`;

        if (start !== undefined && length !== undefined) {
            query += ` LIMIT ${start}, ${length}`;
        }

        try {

            const [rows] = await this.connection.query(query)

            const [totalRows] = await this.connection.query(
                'SELECT COUNT(*) as total FROM pacientes'
            );

            return {
                data: rows,
                total: totalRows[0].total
            };

        } catch (err) {
            console.log(err)
        }

    }

    async submitData(action, data) {

        let query;
        let queryData;
        let message;

        if (action === 'Insert') {
            query = `INSERT INTO pacientes (id, nome, cpf, data_nascimento, telefone, email, endereco) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            queryData = [crypto.randomUUID(), data.nome, data.cpf, data.data_nascimento, data.telefone, data.email, data.endereco];
            message = 'Dados foi inserido!';
        } else if (action === 'Edit') {
            query = `UPDATE pacientes SET nome = ?, cpf = ?, data_nascimento = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?`;
            queryData = [data.nome, data.cpf, data.data_nascimento, data.telefone, data.email, data.endereco, data.id];
            message = 'Dados atualizados!';
        } else if (action === 'Delete') {
            query = `DELETE FROM pacientes WHERE id = ?`;
            queryData = [data.id];
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

    async fetchSingle(id) {
        try {
            const [rows] = await this.connection.query(`SELECT * FROM pacientes WHERE id = ?`, [id]);
            return rows[0];
        } catch (err) {
            console.log(err)
        }
    }
}

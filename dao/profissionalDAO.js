import crypto from 'crypto';

export default class ProfissionalDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchAll(queryData) {

        const { start, length, search } = queryData;
        const search_value = search?.value || "";

        const search_query = search_value ? ` WHERE nome LIKE '%${search_value}%' OR crm LIKE '%${search_value}%' OR telefone LIKE '%${search_value}%' OR especialidade LIKE '%${search_value}%' OR email LIKE '%${search_value}%'` : '';

        let query = `SELECT * FROM profissionais ${search_query}`;

        if (start !== undefined && length !== undefined) {
            query += ` LIMIT ${start}, ${length}`;
        };

        try {

            const [rows] = await this.connection.query(query)

            const [totalRows] = await this.connection.query(
                'SELECT COUNT(*) as total FROM profissionais'
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
            query = `INSERT INTO profissionais (id, nome, crm, especialidade, telefone, email) VALUES (?, ?, ?, ?, ?, ?)`;
            queryData = [crypto.randomUUID(), data.nome, data.crm, data.especialidade, data.telefone, data.email];
            message = 'Dados foi inserido!';
        } else if (action === 'Edit') {
            query = `UPDATE profissionais SET nome = ?, crm = ?, especialidade = ?, telefone = ?, email = ? WHERE id = ?`;
            queryData = [data.nome, data.crm, data.especialidade, data.telefone, data.email, data.id];
            message = 'Dados atualizados!';
        } else if (action === 'Delete') {
            query = `DELETE FROM profissionais WHERE id = ?`;
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
            const [rows] = await this.connection.query(`SELECT * from profissionais WHERE id = ?`, [id]);
            return rows[0];
        } catch (err) {
            console.log(err)
        }
    }
}

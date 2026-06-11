import ProfissionalModel from '../models/profissionalModel.js';
import crypto from 'crypto';

export default class ProfissionalDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchAll(queryData) {

        const { start, length, search } = queryData;
        const search_value = search.value;

        const search_query = search_value ? ` WHERE nome LIKE '%${search_value}%' OR crm LIKE '%${search_value}%' OR telefone LIKE '%${search_value}%' OR especialidade LIKE '%${search_value}%' OR email LIKE '%${search_value}%'` : '';

        const query = `SELECT id, nome, crm, especialidade, telefone, email FROM profissionais ${search_query} LIMIT ${start}, ${length}`;

        try {

            const [rows] = await this.connection.query(query)

            const profissionais = rows.map((data) => {
                return ProfissionalModel.constructFromObject(data)
            })

            const [totalRows] = await this.connection.query(
                'SELECT COUNT(*) as total FROM profissionais'
            );

            return {
                data: profissionais,
                total: totalRows[0].total
            };

        } catch (err) {
            console.log(err)
        }

    }

    async submitData(data) {

        const { action, ...profissionalData } = data;
        const profissional = ProfissionalModel.constructFromObject(profissionalData)

        let query;
        let queryData;
        let message;

        if (action === 'Insert') {
            query = `INSERT INTO profissionais (id, nome, crm, especialidade, telefone, email) VALUES (?, ?, ?, ?, ?, ?)`;
            queryData = [crypto.randomUUID(), profissional.nome, profissional.crm, profissional.especialidade, profissional.telefone, profissional.email];
            message = 'Dados foi inserido!';
        } else if (action === 'Edit') {
            query = `UPDATE profissionais SET nome = ?, crm = ?, especialidade = ?, telefone = ?, email = ? WHERE id = ?`;
            queryData = [profissional.nome, profissional.crm, profissional.especialidade, profissional.telefone, profissional.email, profissional.id];
            message = 'Dados atualizados!';
        } else if (action === 'Delete') {
            query = `DELETE FROM profissionais WHERE id = ?`;
            queryData = [profissional.id];
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
        const query = `SELECT * FROM profissionais WHERE id = ?`;

        try {
            const [rows] = await this.connection.query(query, [id]);
            const profissional = ProfissionalModel.constructFromObject(rows[0]);
            return profissional;
        } catch (err) {
            console.log(err)
        }
    }
}

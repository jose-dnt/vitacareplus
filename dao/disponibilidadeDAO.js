import crypto from 'crypto';

export default class DisponibilidadeDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchAll(queryData) {

        const { profissional_id } = queryData;

        const search_query = profissional_id ? ` profissional_id = '${profissional_id}'` : '';

        let query = `SELECT id, dia_semana, hora_inicio, hora_fim FROM disponibilidade WHERE ${search_query}`;

        try {

            const [rows] = await this.connection.query(query)

            return rows;

        } catch (err) {
            console.log(err)
        }

    }

    async submitData(action, data) {

        let query;
        let queryData;
        let message;

        if (action === 'Insert') {
            query = `INSERT INTO disponibilidade (id, profissional_id, dia_semana, hora_inicio, hora_fim) VALUES (?, ?, ?, ?, ?)`;
            queryData = [crypto.randomUUID(), data.profissional_id, data.dia_semana, data.hora_inicio, data.hora_fim];
            message = 'Dados foi inserido!';
        } else if (action === 'Delete') {
            query = `DELETE FROM disponibilidade WHERE id = ?`;
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

    async removeAll(profissional_id) {
        try {
            await this.connection.query(`DELETE FROM disponibilidade WHERE profissional_id = ?`, [profissional_id]);
            return 'Deletados!';
        } catch (err) {
            console.log(err)
        }
    }

}

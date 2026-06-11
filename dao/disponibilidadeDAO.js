import crypto from 'crypto';

export default class DisponibilidadeDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchAll(queryData) {

        const { start, length, search } = queryData;
        const search_value = search?.value || "";

        const search_query = search_value ? ` WHERE profissional_id = '%${search_value}%'` : '';

        let query = `SELECT id, dia_semana, hora_inicio, hora_fim FROM disponibilidade WHERE ${search_query}`;

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
            query = `INSERT INTO disponibilidades (id, profissional_id, dia_semana, hora_inicio, hora_fim) VALUES (?, ?, ?, ?, ?)`;
            queryData = [crypto.randomUUID(), data.profissional_id, data.dia_semana, data.hora_inicio, data.hora_fim];
            message = 'Dados foi inserido!';
        } else if (action === 'Edit') {
            query = `UPDATE disponibilidades SET profissional_id = ?, dia_semana = ?, hora_inicio = ?, hora_fim = ? WHERE id = ?`;
            queryData = [data.profissional_id, data.dia_semana, data.hora_inicio, data.hora_fim, data.id];
            message = 'Dados atualizados!';
        } else if (action === 'Delete') {
            query = `DELETE FROM disponibilidades WHERE id = ?`;
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
            const [rows] = await this.connection.query(`SELECT * FROM disponibilidades WHERE id = ?`, [id]);
            return rows[0];
        } catch (err) {
            console.log(err)
        }
    }
}

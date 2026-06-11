import DisponibilidadeModel from '../models/disponibilidadeModel.js';

export default class DisponibilidadeDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchAll(queryData) {

        const { start, length, search } = queryData;

        const search_value = search.value;

        const search_query = search_value ? ` WHERE profissional_id = '%${search_value}%'` : '';

        const query = `SELECT id, dia_semana, hora_inicio, hora_fim FROM disponibilidade WHERE ${search_query} LIMIT ${start}, ${length}`;

        try {

            const [rows] = await this.connection.query(query)

            const disponibilidades = rows.map((data) => {
                return DisponibilidadeModel.constructFromObject(data)
            })

            return disponibilidades;
        } catch (err) {
            console.log(err)
        }

    }

    async submitData(data) {

        const { action, ...disponibilidadeData } = data;
        const disponibilidade = DisponibilidadeModel.constructFromObject(disponibilidadeData)

        let query;
        let queryData;
        let message;

        if (action === 'Insert') {
            query = `INSERT INTO disponibilidades (id, profissional_id, dia_semana, hora_inicio, hora_fim) VALUES (?, ?, ?, ?, ?)`;
            queryData = [disponibilidade.id, disponibilidade.profissional_id, disponibilidade.dia_semana, disponibilidade.hora_inicio, disponibilidade.hora_fim];
            message = 'Dados foi inserido!';
        } else if (action === 'Edit') {
            query = `UPDATE disponibilidades SET profissional_id = ?, dia_semana = ?, hora_inicio = ?, hora_fim = ? WHERE id = ?`;
            queryData = [disponibilidade.profissional_id, disponibilidade.dia_semana, disponibilidade.hora_inicio, disponibilidade.hora_fim, disponibilidade.id];
            message = 'Dados atualizados!';
        } else if (action === 'Delete') {
            query = `DELETE FROM disponibilidades WHERE id = ?`;
            queryData = [disponibilidade.id];
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
        const query = `SELECT * FROM disponibilidades WHERE id = ?`;

        try {
            const [rows] = await this.connection.query(query, [id]);
            const disponibilidade = DisponibilidadeModel.constructFromObject(rows[0]);
            return disponibilidade;
        } catch (err) {
            console.log(err)
        }
    }
}

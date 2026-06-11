import crypto from 'crypto';

export default class ConsultaDAO {

    constructor(connection) {
        this.connection = connection
    }

    async fetchAll(queryData) {

        const { start, length, status } = queryData;

        let query = `SELECT c.id, pa.id AS paciente_id, pa.nome AS paciente_nome, pr.id AS profissional_id, pr.nome AS profissional_nome, c.data, c.horario, c.status, c.diagnostico, c.prescricao, c.observacoes FROM consultas c, pacientes pa, profissionais pr WHERE c.paciente_id = pa.id AND c.profissional_id = pr.id ORDER BY c.data DESC, c.horario DESC`;

        if (start !== undefined && length !== undefined) {
            query += ` LIMIT ${start}, ${length}`;
        }

        try {

            const [rows] = await this.connection.query(query)

            const [totalRows] = await this.connection.query(
                'SELECT COUNT(*) as total FROM consultas'
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
            query = `INSERT INTO consultas (id, paciente_id, profissional_id, data, horario, status, diagnostico, prescricao, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            queryData = [crypto.randomUUID(), data.paciente_id, data.profissional_id, data.data, data.horario, data.status, data.diagnostico, data.prescricao, data.observacoes];
            message = 'Dados foi inserido!';
        } else if (action === 'Edit') {
            query = `UPDATE consultas SET paciente_id = ?, profissional_id = ?, data = ?, horario = ?, diagnostico = ?, prescricao = ?, observacoes = ? WHERE id = ?`;
            queryData = [data.paciente_id, data.profissional_id, data.data, data.horario, data.diagnostico, data.prescricao, data.observacoes, data.id];
            message = 'Dados atualizados!';
        } else if (action === 'Delete') {
            query = `DELETE FROM consultas WHERE id = ?`;
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

    async updateStatus(id, status) {
        try {
            await this.connection.query(
                'UPDATE consultas SET status = ? WHERE id = ?',
                [status, id]
            );
        } catch (err) {
            console.log(err);
        }
    }

    async fetchSingle(id) {
        try {
            const [rows] = await this.connection.query(`SELECT * FROM consultas WHERE id = ?`, [id]);
            return rows[0];
        } catch (err) {
            console.log(err)
        }
    }
}

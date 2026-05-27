const connection = require('../db');

class PacienteModel {
    static fetchAll(queryData, callback) {
        const { draw, start, length, order, columns, search } = queryData;

        const column_index = order && order[0] && order[0].column;
        const column_sort_order = order === undefined ? 'desc' : order[0]['dir'];
        const column_name = column_index ? columns[column_index] : 'id';
        const search_value = search.value;

        const search_query = search_value ? ` WHERE nome LIKE '%${search_value}%' OR cpf LIKE '%${search_value}%' OR telefone LIKE '%${search_value}%' OR email LIKE '%${search_value}%' OR endereco LIKE '%${search_value}%'` : '';

        const query1 = `SELECT id, nome, cpf, data_nascimento, telefone, email, endereco FROM pacientes ${search_query} ORDER BY ${column_name} ${column_sort_order} LIMIT ${start}, ${length}`;
        const query2 = `SELECT COUNT(*) AS Total FROM pacientes`;
        const query3 = `SELECT COUNT(*) AS Total FROM pacientes ${search_query}`;

        connection.query(query1, (dataError, dataResult) => {
            if (dataError) return callback(dataError);

            connection.query(query2, (totalDataError, totalDataResult) => {
                if (totalDataError) return callback(totalDataError);

                connection.query(query3, (totalFilterDataError, totalFilterDataResult) => {
                    if (totalFilterDataError) return callback(totalFilterDataError);

                    const response = {
                        draw: draw,
                        recordsTotal: totalDataResult[0]['Total'],
                        recordsFiltered: totalFilterDataResult[0]['Total'],
                        data: dataResult
                    };
                    callback(null, response);
                });
            });
        });
    }

    static submitData(data, callback) {
        const { id, nome, cpf, data_nascimento, telefone, email, endereco, action } = data;
        let query;
        let queryData;
        let message;

        if (action === 'Insert') {
            query = `INSERT INTO pacientes (id, nome, cpf, data_nascimento, telefone, email, endereco) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            queryData = [id, nome, cpf, data_nascimento, telefone, email, endereco];
            message = 'Dados foi inserido!';
        } else if (action === 'Edit') {
            query = `UPDATE pacientes SET nome = ?, cpf = ?, data_nascimento = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?`;
            queryData = [nome, cpf, data_nascimento, telefone, email, endereco, id];
            message = 'Dados atualizados!';
        } else if (action === 'Delete') {
            query = `DELETE FROM pacientes WHERE id = ?`;
            queryData = [id];
            message = 'Deletado!';
        } else {
            return callback(new Error('Ação inválida!'));
        }

        connection.query(query, queryData, (error, result) => {
            if (error) return callback(error);
            callback(null, { message: message });
        });
    }

    static fetchSingle(id, callback) {
        const query = `SELECT * FROM pacientes WHERE id = ?`;

        connection.query(query, [id], (error, result) => {
            if (error) return callback(error);
            callback(null, result[0]);
        });
    }
}

module.exports = PacienteModel;

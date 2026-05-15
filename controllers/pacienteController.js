const PacienteModel = require('../models/pacienteModel');
const path = require('path');

class PacienteController {
    static fetchData(req, res) {
        PacienteModel.fetchAll(req.query, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha acessando os dados!' });
                console.log(1)
            }
            console.log(2)

            res.json(data);
        });
    }

    static submitData(req, res) {
        PacienteModel.submitData(req.body, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha enviando os dados!' });
            }
            res.json(result);
        });
    }

    static fetchSingle(req, res) {
        PacienteModel.fetchSingle(req.params.id, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha acessando os dados!' });
            }
            res.json(data);
        });
    }
}

module.exports = PacienteController;

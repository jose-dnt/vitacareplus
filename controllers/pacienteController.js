const PacienteModel = require('../models/pacienteModel');
const path = require('path');

class PacienteController {
    static index(req, res) {
        res.sendFile(path.join(__dirname, '..', 'views', 'pacientes.html'));
    }
    static fetchData(req, res) {
        PacienteModel.fetchAll(req.query, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha acessando os dados!' });
            }
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

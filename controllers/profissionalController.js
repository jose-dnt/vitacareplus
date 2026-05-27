const ProfissionalModel = require('../models/profissionalModel');
const path = require('path');

class PacienteController {
    static index(req, res) {
        res.sendFile(path.join(__dirname, '..', 'views', 'profissional.html'));
    }
    static fetchData(req, res) {
        ProfissionalModel.fetchAll(req.query, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha acessando os dados!' });
            }
            res.json(data);
        });
    }

    static submitData(req, res) {
        ProfissionalModel.submitData(req.body, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha enviando os dados!' });
            }
            res.json(result);
        });
    }

    static fetchSingle(req, res) {
        ProfissionalModel.fetchSingle(req.params.id, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Falha acessando os dados!' });
            }
            res.json(data);
        });
    }
}

module.exports = PacienteController;

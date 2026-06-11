import path from 'path';
import ProfissionalService from '../services/profissionalService.js';

export default class ProfissionalController {
    static index(req, res) {
        res.sendFile(path.join(import.meta.dirname, '..', 'views', 'profissionais.html'));
    }
    static async fetchData(req, res) {
        try {
            const data = await ProfissionalService.fetchData(req.query);
            res.json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        };
    }

    static async submitData(req, res) {
        try {
            const result = await ProfissionalService.submitData(req.body);
            res.json(result)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha enviando os dados!' });
        }
    }

    static async fetchSingle(req, res) {
        try {
            const data = await ProfissionalService.fetchSingle(req.params.id)
            res.json(data)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        }
    }
}
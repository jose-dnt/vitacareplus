import path from 'path';
import DisponibilidadeService from '../services/disponibilidadeService.js';

export default class DisponibilidadeController {
    static index(req, res) {
        res.sendFile(path.join(import.meta.dirname, '..', 'views', 'disponibilidades.html'));
    }
    static async fetchData(req, res) {
        try {
            const data = await DisponibilidadeService.fetchData(req.query);
            res.json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        };
    }

    static async submitData(req, res) {
        try {
            const result = await DisponibilidadeService.submitData(req.body);
            res.json(result)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha enviando os dados!' });
        }
    }

    static async fetchSingle(req, res) {
        try {
            const data = await DisponibilidadeService.fetchSingle(req.params.id)
            res.json(data)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        }
    }
}
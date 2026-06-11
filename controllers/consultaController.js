import path from 'path';
import ConsultaService from '../services/consultaService.js';

export default class ConsultaController {
    static index(req, res) {
        res.sendFile(path.join(import.meta.dirname, '..', 'views', 'consultas.html'));
    }
    static async fetchData(req, res) {
        try {
            const data = await ConsultaService.fetchData(req.query);
            res.json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        };
    }

    static async submitData(req, res) {
        try {
            const result = await ConsultaService.submitData(req.body);
            res.json(result)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha enviando os dados!' });
        }
    }

    static async fetchSingle(req, res) {
        try {
            const data = await ConsultaService.fetchSingle(req.params.id)
            res.json(data)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        }
    }
}
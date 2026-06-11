import path from 'path';
import PacienteService from '../services/pacienteService.js';

export default class PacienteController {
    static index(req, res) {
        res.sendFile(path.join(import.meta.dirname, '..', 'views', 'pacientes.html'));
    }
    static async fetchData(req, res) {
        try {
            const data = await PacienteService.fetchData(req.query);
            res.json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        };
    }

    static async submitData(req, res) {
        try {
            const result = await PacienteService.submitData(req.body);
            res.json(result)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha enviando os dados!' });
        }
    }

    static async fetchSingle(req, res) {
        try {
            const data = await PacienteService.fetchSingle(req.params.id)
            res.json(data)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        }
    }
}
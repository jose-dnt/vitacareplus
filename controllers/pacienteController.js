import PacienteDAO from '../dao/pacienteDAO.js';
import path from 'path';
import { conectarBanco } from '../db.js';

const db = await conectarBanco()
const DAO = new PacienteDAO(db);

export default class PacienteController {
    static index(req, res) {
        res.sendFile(path.join(import.meta.dirname, '..', 'views', 'pacientes.html'));
    }
    static async fetchData(req, res) {
        try {
            const result = await DAO.fetchAll(req.query);

            res.json({
                draw: Number(req.query.draw),
                recordsTotal: result.total,
                recordsFiltered: result.total,
                data: result.data
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        };
    }

    static async submitData(req, res) {
        try {
            const result = await DAO.submitData(req.body);
            res.json(result)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha enviando os dados!' });
        }
    }

    static async fetchSingle(req, res) {
        try {
            const data = await DAO.fetchSingle(req.params.id)
            res.json(data)
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Falha acessando os dados!' });
        }
    }
}
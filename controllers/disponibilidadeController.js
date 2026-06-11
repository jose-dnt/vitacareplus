import DisponibilidadeDAO from '../dao/disponibilidadeDAO.js';
import { conectarBanco } from '../db.js';

const db = await conectarBanco()
const DAO = new DisponibilidadeDAO(db);

export default class DisponibilidadeController {
    static async fetchData(req, res) {
        try {
            const data = await DAO.fetchAll(req.query);
            res.json(data)
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
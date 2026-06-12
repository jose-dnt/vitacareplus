import DisponibilidadeDAO from '../dao/disponibilidadeDAO.js';
import DisponibilidadeModel from '../models/disponibilidadeModel.js';
import { conectarBanco } from '../db.js';

const db = await conectarBanco();
const DAO = new DisponibilidadeDAO(db);

export default class DisponibilidadeService {

    static async fetchData(query) {
        try {
            const result = await DAO.fetchAll(query);

            const disponibilidades = result.map((row) => {
                return DisponibilidadeModel.constructFromObject({profissional_id: query.profissional_id, ...row})
            })

            return disponibilidades;
        } catch (err) {
            console.error(err);
        };
    }

    static async submitData(body) {
        try {
            const { action, ...data } = body;
            const disponibilidade = DisponibilidadeModel.constructFromObject(data)
            const result = await DAO.submitData(action, disponibilidade);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    static async removeAll(profissional_id) {
        try {
            const result = await DAO.removeAll(profissional_id);
            return result;
        } catch (err) {
            console.error(err);
        }
    }
}
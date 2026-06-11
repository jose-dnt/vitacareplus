import DisponibilidadeDAO from '../dao/disponibilidadeDAO.js';
import DisponibilidadeModel from '../models/disponibilidadeModel.js';
import { conectarBanco } from '../db.js';

const db = await conectarBanco();
const DAO = new DisponibilidadeDAO(db);

export default class DisponibilidadeService {

    static async fetchData(query) {
        try {
            const result = await DAO.fetchAll(query);

            const disponibilidades = result.data.map((row) => {
                return DisponibilidadeModel.constructFromObject(row)
            })

            return {
                draw: Number(query.draw),
                recordsTotal: result.total,
                recordsFiltered: result.total,
                data: disponibilidades
            };
        } catch (err) {
            console.error(err);
        };
    }

    static async submitData(body) {
        try {
            const {action, ...data} = body;
            const result = await DAO.submitData(action, data);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    static async fetchSingle(id) {
        try {
            const data = await DAO.fetchSingle(id)
            const disponibilidade = DisponibilidadeModel.constructFromObject(data);
            return disponibilidade;
        } catch (err) {
            console.error(err);
        }
    }
}
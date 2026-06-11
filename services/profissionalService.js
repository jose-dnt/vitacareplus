import ProfissionalDAO from '../dao/profissionalDAO.js';
import ProfissionalModel from '../models/profissionalModel.js';
import { conectarBanco } from '../db.js';

const db = await conectarBanco();
const DAO = new ProfissionalDAO(db);

export default class ProfissionalService {

    static async fetchData(query) {
        try {
            const result = await DAO.fetchAll(query);

            const profissionais = result.data.map((row) => {
                return ProfissionalModel.constructFromObject(row)
            })

            return {
                draw: Number(query.draw),
                recordsTotal: result.total,
                recordsFiltered: result.total,
                data: profissionais
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
            const profissional = ProfissionalModel.constructFromObject(data);
            return profissional;
        } catch (err) {
            console.error(err);
        }
    }
}
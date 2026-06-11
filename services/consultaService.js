import ConsultaDAO from '../dao/consultaDAO.js';
import ConsultaModel from '../models/consultaModel.js';
import { conectarBanco } from '../db.js';

const db = await conectarBanco();
const DAO = new ConsultaDAO(db);

export default class ConsultaService {

    static async fetchData(query) {
        try {
            const result = await DAO.fetchAll(query);

            const consultas = result.data.map((data) => {
                return ConsultaModel.constructFromObject(data)
            })

            return {
                draw: Number(query.draw),
                recordsTotal: result.total,
                recordsFiltered: result.total,
                data: consultas
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
            const consulta = ConsultaModel.constructFromObject(data);
            return consulta;
        } catch (err) {
            console.error(err);
        }
    }
}
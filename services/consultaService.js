import ConsultaDAO from '../dao/consultaDAO.js';
import ConsultaModel from '../models/consultaModel.js';
import { conectarBanco } from '../db.js';

const db = await conectarBanco();
const DAO = new ConsultaDAO(db);

export default class ConsultaService {

    static async fetchData(query) {
        try {
            const result = await DAO.fetchAll(query);

            const consultas = result.data.map((row) => {
                return ConsultaModel.constructFromObject(row)
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
            const { action, ...data } = body;
            const consulta = ConsultaModel.constructFromObject(data);
            const result = await DAO.submitData(action, consulta);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    static async updateStatus(id, status) {
        try {
            await DAO.updateStatus(id, status)
        } catch (err) {
            console.log(err);
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
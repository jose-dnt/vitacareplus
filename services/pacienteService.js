import PacienteDAO from '../dao/pacienteDAO.js';
import PacienteModel from '../models/pacienteModel.js';
import { conectarBanco } from '../db.js';

const db = await conectarBanco();
const DAO = new PacienteDAO(db);

export default class PacienteService {

    static async fetchData(query) {
        try {
            const result = await DAO.fetchAll(query);

            const pacientes = result.data.map((row) => {
                return PacienteModel.constructFromObject(row)
            })

            return {
                draw: Number(query.draw),
                recordsTotal: result.total,
                recordsFiltered: result.total,
                data: pacientes
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
            const paciente = PacienteModel.constructFromObject(data);
            return paciente;
        } catch (err) {
            console.error(err);
        }
    }
}
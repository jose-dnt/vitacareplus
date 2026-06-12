import ProfissionalDAO from '../dao/profissionalDAO.js';
import ProfissionalModel from '../models/profissionalModel.js';
import DisponibilidadeService from './disponibilidadeService.js';
import { conectarBanco } from '../db.js';

const db = await conectarBanco();
const DAO = new ProfissionalDAO(db);

export default class ProfissionalService {

    static async fetchData(query) {
        try {
            const result = await DAO.fetchAll(query);

            const profissionais = await Promise.all(
                result.data.map(async (row) => {
                    const disponibilidade = await DisponibilidadeService.fetchData({
                        profissional_id: row.id
                    });

                    return ProfissionalModel.constructFromObject({
                        ...row,
                        disponibilidade
                    });
                })
            );

            return {
                draw: Number(query.draw),
                recordsTotal: result.total,
                recordsFiltered: result.total,
                data: profissionais
            };
        } catch (err) {
            console.error(err);
        };
    };

    static async submitData(body) {
        try {
            const { action, disponibilidades, ...data } = body;

            const profissional = ProfissionalModel.constructFromObject(data);

            const result = await DAO.submitData(action, profissional);

            const dispData = disponibilidades.map(disp => { return { profissional_id: profissional.id, ...disp } });

            await DisponibilidadeService.removeAll(profissional.id);

            for (const disp of dispData) {
                await DisponibilidadeService.submitData({
                    action: "Insert",
                    ...disp
                });
            }

            return result;
        } catch (err) {
            console.error(err);
        }
    }

    static async fetchSingle(id) {
        try {
            const data = await DAO.fetchSingle(id)
            const disponibilidade = await DisponibilidadeService.fetchData({ profissional_id: data.id });
            const profissional = ProfissionalModel.constructFromObject({ ...data, disponibilidade });
            return profissional;
        } catch (err) {
            console.error(err);
        }
    }
}
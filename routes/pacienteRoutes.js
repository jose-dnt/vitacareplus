import express from 'express';
import PacienteController from '../controllers/pacienteController.js';
export const router = express.Router();

// Rota principal que serve o HTML
router.get('/', PacienteController.index);

// Rotas da API
router.get('/fetchData', PacienteController.fetchData);
router.post('/submitData', PacienteController.submitData);
router.get('/fetchData/:id', PacienteController.fetchSingle);
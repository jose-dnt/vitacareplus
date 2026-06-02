import express from 'express';
import ProfissionalController from '../controllers/profissionalController.js';
export const router = express.Router();

// Rota principal que serve o HTML
router.get('/', ProfissionalController.index);

// Rotas da API
router.get('/fetchData', ProfissionalController.fetchData);
router.post('/submitData', ProfissionalController.submitData);
router.get('/fetchData/:id', ProfissionalController.fetchSingle);
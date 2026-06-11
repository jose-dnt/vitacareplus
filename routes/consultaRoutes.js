import express from 'express';
import ConsultaController from '../controllers/consultaController.js';
export const router = express.Router();

// Rota principal que serve o HTML
router.get('/', ConsultaController.index);

// Rotas da API
router.get('/fetchData', ConsultaController.fetchData);
router.get('/fetchData/:id', ConsultaController.fetchSingle);
router.post('/submitData', ConsultaController.submitData);
router.put('/status/:id', ConsultaController.updateStatus);

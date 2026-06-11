import express from 'express';
import DisponibilidadeController from '../controllers/disponibilidadeController.js';
export const router = express.Router();

// Rotas da API
router.get('/fetchData', DisponibilidadeController.fetchData);
router.post('/submitData', DisponibilidadeController.submitData);
router.get('/fetchData/:id', DisponibilidadeController.fetchSingle);
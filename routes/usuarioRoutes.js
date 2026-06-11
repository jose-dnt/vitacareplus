import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
export const router = express.Router();

// Rotas da API
router.post('/register', UsuarioController.register);
router.post('/login', UsuarioController.login);

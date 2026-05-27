const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');

// Rota principal que serve o HTML
router.get('/', PacienteController.index);

// Rotas da API
router.get('/fetchData', PacienteController.fetchData);
router.post('/submitData', PacienteController.submitData);
router.get('/fetchData/:id', PacienteController.fetchSingle);

module.exports = router;

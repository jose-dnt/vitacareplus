const express = require('express');
const router = express.Router();
const ProfissionalController = require('../controllers/profissionalController');

// Rota principal que serve o HTML
router.get('/', ProfissionalController.index);

// Rotas da API
router.get('/fetchData', ProfissionalController.fetchData);
router.post('/submitData', ProfissionalController.submitData);
router.get('/fetchData/:id', ProfissionalController.fetchSingle);

module.exports = router;

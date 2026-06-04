const express = require('express');

const historicoController = require('./historico.controller');

const router = express.Router();

router.get('/processamentos', historicoController.listar);

router.get(
  '/processamentos/:processamentoId',
  historicoController.buscarPorId
);

router.get(
  '/processamentos/:processamentoId/download/:tipo',
  historicoController.download
);

router.get(
  '/processamentos/:processamentoId/status',
  historicoController.status
);
module.exports = router;
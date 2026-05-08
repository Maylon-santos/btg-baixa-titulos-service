const express = require('express');

const millenniumAuthService = require('./millennium.auth.service');
const consultaService = require('./millennium.consulta.service');

const router = express.Router();

router.get('/millennium/testar-conexao', async (req, res) => {
  try {
    const session = await millenniumAuthService.login();

    await millenniumAuthService.finalizarSessao();

    return res.status(200).json({
      success: true,
      message: 'Conexão com Millennium validada com sucesso',
      sessionStarted: Boolean(session),
      sessionClosed: true
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao testar conexão com Millennium',
      error: error.message,
      details: error.response?.data || null
    });
  }
});

router.post('/millennium/testar-consulta', async (req, res) => {
  try {
    const resultado = await consultaService.consultarTitulo(
      req.body
    );

    return res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      details: error.response?.data || null
    });
  }
});

module.exports = router;
const express = require('express');

const millenniumAuthService = require('./millennium.auth.service');

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

module.exports = router;
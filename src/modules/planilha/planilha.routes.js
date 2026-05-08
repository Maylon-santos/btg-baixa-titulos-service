const express = require('express');

const upload = require('../../shared/middlewares/upload.middleware');

const controller = require('./planilha.controller');

const router = express.Router();

router.post(
  '/planilha/processar',
  upload.single('file'),
  controller.processar
);

module.exports = router;
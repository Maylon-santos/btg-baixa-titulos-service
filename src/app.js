const express = require('express');
const cors = require('cors');
const planilhaRoutes = require('./modules/planilha/planilha.routes');

const healthRoutes = require('./shared/http/health.routes');




const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(healthRoutes);
app.use(planilhaRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

module.exports = app;
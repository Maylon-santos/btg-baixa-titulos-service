const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    service: 'btg-baixa-titulos-service',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
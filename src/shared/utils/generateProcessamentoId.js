const { v4: uuidv4 } = require('uuid');

function generateProcessamentoId() {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');

  return `BTG-${date}-${uuidv4().slice(0, 6).toUpperCase()}`;
}

module.exports = generateProcessamentoId;
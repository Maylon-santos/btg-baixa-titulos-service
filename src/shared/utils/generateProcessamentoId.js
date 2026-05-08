const crypto = require('crypto');

function generateProcessamentoId() {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');

  const randomId = crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase();

  return `BTG-${date}-${randomId}`;
}

module.exports = generateProcessamentoId;
function sanitizeDocument(value) {
    return String(value || '').replace(/\D/g, '');
  }
  
  module.exports = sanitizeDocument;
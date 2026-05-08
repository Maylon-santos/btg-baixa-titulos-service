function normalizeHeader(header) {
    return String(header || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');
  }
  
  module.exports = normalizeHeader;
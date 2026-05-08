function normalizeDate(value) {
    if (!value) {
      return null;
    }
  
    // Excel serial date
    if (typeof value === 'number') {
      const excelEpoch = new Date(1899, 11, 30);
  
      const parsed = new Date(
        excelEpoch.getTime() + value * 86400000
      );
  
      const day = String(parsed.getDate()).padStart(2, '0');
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const year = parsed.getFullYear();
  
      return `${day}/${month}/${year}`;
    }
  
    // já está em DD/MM/YYYY
    if (typeof value === 'string') {
      const trimmed = value.trim();
  
      const match =
        trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  
      if (match) {
        return trimmed;
      }
    }
  
    return null;
  }
  
  module.exports = normalizeDate;
function parseODataDate(value) {
    if (!value) {
      return null;
    }
  
    const match = String(value).match(/\/Date\((\d+)(?:[-+]\d+)?\)\//);
  
    if (!match) {
      return null;
    }
  
    const timestamp = Number(match[1]);
  
    const date = new Date(timestamp);
  
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
  module.exports = parseODataDate;
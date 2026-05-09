function formatDateToIso(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  // Excel serial number
  if (typeof value === 'number') {
    const excelEpoch = new Date(1899, 11, 30);

    const parsed = new Date(
      excelEpoch.getTime() + value * 86400000
    );

    return formatDateToIso(parsed);
  }

  // String DD/MM/YYYY
  if (typeof value === 'string') {
    const trimmed = value.trim();

    const matchBr =
      trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (matchBr) {
      const [, day, month, year] = matchBr;

      return `${year}-${month}-${day}`;
    }

    // já está ISO
    const matchIso =
      trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (matchIso) {
      return trimmed;
    }
  }

  return null;
}

module.exports = normalizeDate;
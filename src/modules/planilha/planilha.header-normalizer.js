const normalizeHeader = require('../../shared/utils/normalizeHeader');
const HEADER_ALIASES = require('./constants/headerAliases');

function resolveCanonicalKey(normalizedKey) {
  for (const [canonicalKey, aliases] of Object.entries(HEADER_ALIASES)) {
    if (canonicalKey === normalizedKey || aliases.includes(normalizedKey)) {
      return canonicalKey;
    }
  }

  return normalizedKey;
}

function normalizeRowHeaders(row) {
  const normalized = {};

  Object.entries(row).forEach(([key, value]) => {
    const normalizedKey = normalizeHeader(key);
    const canonicalKey = resolveCanonicalKey(normalizedKey);

    normalized[canonicalKey] = value;
  });

  return normalized;
}

module.exports = {
  normalizeRowHeaders
};
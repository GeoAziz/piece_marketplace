function isNonEmptyString(v) { return typeof v === 'string' && v.trim().length > 0; }
function isPositiveNumber(v) { return typeof v === 'number' && Number.isFinite(v) && v >= 0; }
function requireField(obj, field) {
  if (!obj || !(field in obj)) throw Object.assign(new Error(`${field} is required`), { status: 400 });
  return obj[field];
}

module.exports = { isNonEmptyString, isPositiveNumber, requireField };

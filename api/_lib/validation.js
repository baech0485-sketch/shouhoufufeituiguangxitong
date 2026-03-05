export function getTrimmedText(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

export function parseRequiredTextFields(payload, fields) {
  const values = {};
  const missingFields = [];

  fields.forEach((field) => {
    const value = getTrimmedText(payload?.[field]);
    if (!value) {
      missingFields.push(field);
      return;
    }
    values[field] = value;
  });

  if (missingFields.length > 0) {
    return {
      ok: false,
      missingFields,
    };
  }

  return {
    ok: true,
    values,
  };
}

export function parseNonNegativeAmount(value) {
  const amount =
    typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }
  return amount;
}

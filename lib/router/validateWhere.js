/**
 * Validates the 'where' filter object.
 * @param {Object} where - The parsed 'where' filter.
 * @param {Array} allowedFilters - Array of allowed filter fields.
 * @throws {Error} - Throws error if validation fails.
 */
export function validateWhere(where, allowedFilters = []) {
  const allowedOperators = ['$eq', '$ne', '$lt', '$lte', '$gt', '$gte', '$like'];

  function validateObject(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (allowedFilters.length > 0 && !allowedFilters.includes(key)) {
        throw new Error(`Filtering by '${key}' is not allowed.`);
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        // Nested conditions
        for (const [op, val] of Object.entries(value)) {
          if (!allowedOperators.includes(op)) {
            throw new Error(`Operator '${op}' is not supported for field '${key}'.`);
          }
          // Optionally, add more validation for 'val' based on your requirements
        }
      }
    }
  }

  if (typeof where !== 'object' || Array.isArray(where)) {
    throw new Error(`'where' filter must be an object.`);
  }

  validateObject(where);
}

export default validateWhere;

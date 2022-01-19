export const VALIDATION_RULES = {
  VALID_ID_PASSPORT: 'valid_id_passport',
  FIRST_LAST_NAME: 'first_last_name',
  LATIN_ONLY: 'latin_only',
};

const isValidId = (id) =>
  !isNaN(id) &&
  Array.from(id, Number).reduce((sum, digit, i) => {
    digit = digit * ((i % 2) + 1);
    return sum + (digit > 9 ? digit - 9 : digit);
  }) %
    10 ===
    0;

/* need to find validation rules for this
const isValidPassport = (passport) => {
  return true;
}; */

export const validPassport = {
  ruleName: VALIDATION_RULES.VALID_ID_PASSPORT,
  validateFunc: (value, requirement, attribute) => isValidId(value), // || isValidPassport(value),
  errorMessage: 'National ID/Passport number is invalid.',
};

export const firstLastNameValidate = {
  ruleName: VALIDATION_RULES.FIRST_LAST_NAME,
  validateFunc: (value) => new RegExp(/^\w+(?:\s\w+)+$/).test(value),
  errorMessage:
    'The :attribute should consist of first and last name separated with space.',
};

export const latinOnly = {
  ruleName: VALIDATION_RULES.LATIN_ONLY,
  validateFunc: (value) =>  new RegExp(/^[a-zA-Z'’. ]*$/).test(value),
  errorMessage: 'The :attribute should use latin characters only',
};


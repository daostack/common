export const VALIDATION_RULES = {
  VALID_ID_PASSPORT: 'valid_id_passport',
};

const isValidId = (id) => (
  !isNaN(id) &&
  Array.from(id, Number)
    .reduce((sum, digit, i) => {
      digit = digit * ((i % 2) + 1);
      return sum + (digit > 9 ? digit - 9 : digit);
    }) % 10 === 0
);

/* need to find validation rules for this
const isValidPassport = (passport) => {
  return true;
}; */

export const validPassport = {
  ruleName: VALIDATION_RULES.VALID_ID_PASSPORT,
  validateFunc: (value, requirement, attribute) => isValidId(value), // || isValidPassport(value),
  errorMessage: 'National ID/Passport number is invalid.',
};

export const VALIDATION_RULES = {
  FIRST_LAST_NAME: 'first_last_name',
};

export const firstLastNameValidate = {
  ruleName: VALIDATION_RULES.FIRST_LAST_NAME,
  validateFunc: (value, requirement, attribute) => (new RegExp(/(\w.+\s).+/)).test(value),
  errorMessage: 'The :attribute should consist of first and last name separated with space.',
};

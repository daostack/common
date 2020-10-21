export const VALIDATION_RULES = {
  FIRST_LAST_NAME: 'first_last_name',
};

export const firstLastNameValidate = {
  ruleName: VALIDATION_RULES.FIRST_LAST_NAME,
  validateFunc: (value, requirement, attribute) => value.match('/^(0[1-9]|1[0-2])/?([0-9]{2})$/'),
  errorMessage: 'The :attribute should consist of first and last name separated with space.',
};

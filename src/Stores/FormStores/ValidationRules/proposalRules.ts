// The amount requested cannot be greater than the Common balance.

export enum PROPOSAL_VALIDATION_RULES {
  MAX_AMOUNT = 'maxAmount',
}

export const validateMaxAmount = {
  ruleName: PROPOSAL_VALIDATION_RULES.MAX_AMOUNT,
  validateFunc: (value: string, requirement: string) => {
    const maxAmount = Number(requirement);
    const currentAmount = Number(value);

    return maxAmount >= currentAmount;
  },
  errorMessage:
    'The amount requested cannot be greater than the Common balance.',
};

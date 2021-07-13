export enum AMOUNT_RULES {
  FUNDING_MINIMUM_AMOUNT_RULE = 'fundingMinimumAmount',
}

export const validateCustomAmount = {
  ruleName: AMOUNT_RULES.FUNDING_MINIMUM_AMOUNT_RULE,
  validateFunc: (value: string, requirement: string) => {
    const fundingMinimumAmount = Number(requirement);
    const enteredAmount = Number(value);
    return fundingMinimumAmount === 0
      ? enteredAmount >= 5 || enteredAmount === 0
      : enteredAmount >= fundingMinimumAmount;
  },
  errorMessage: 'Custom amount is invalid',
};

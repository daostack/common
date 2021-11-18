export enum AMOUNT_RULES {
  MIN_FEE_TO_JOIN_RULE = 'minFeeToJoin',
}

export const validateCustomAmount = {
  ruleName: AMOUNT_RULES.MIN_FEE_TO_JOIN_RULE,
  validateFunc: (value: string, requirement: string) => {
    const minFeeToJoin = Number(requirement);
    const enteredAmount = Number(value);
    return minFeeToJoin === 0 ? (enteredAmount >= 5 || enteredAmount === 0) : enteredAmount >= minFeeToJoin;
  },
  errorMessage: 'Custom amount is invalid',
};

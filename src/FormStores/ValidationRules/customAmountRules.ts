export enum AMOUNT_RULES {
  MIN_FEE_TO_JOIN_RULE = 'minFeeToJoin',
}

export const validateCustomAmount = {
  ruleName: AMOUNT_RULES.MIN_FEE_TO_JOIN_RULE,
  validateFunc: (value: string, requirement: string) => {
    const minFeeToJoin = Number(requirement);
    const enteredAmount = Number(value);
    const isMinFee = enteredAmount >= 5;
    return minFeeToJoin > 0 ? isMinFee : enteredAmount === 0 || isMinFee;
  },
  errorMessage: 'Custom amount is invalid',
};

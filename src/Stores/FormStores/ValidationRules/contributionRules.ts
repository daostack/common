// The amount requested cannot be greater than the Common balance.
import {CurrencySymbols} from '~/Util/locale';

const MAX_CONTRIBUTION = '500';
const MIN_CONTRIBUTION = '10';

export enum CONTRIBUTION_VALIDATION_RULES {
  CONTRIBUTION_RANGE = 'contributionRange',
}

export const validateContributionRange = {
  ruleName: CONTRIBUTION_VALIDATION_RULES.CONTRIBUTION_RANGE,
  validateFunc: (value: string) => {
    const currentAmount = Number(value);
    return currentAmount <= 500 && currentAmount >= 10;
  },
  errorMessage: `The amount must be at least ${
    CurrencySymbols.SHEKEL
  }${MIN_CONTRIBUTION} and at most ${CurrencySymbols.SHEKEL}${parseFloat(
    MAX_CONTRIBUTION,
  ).toLocaleString('en')}.`,
};

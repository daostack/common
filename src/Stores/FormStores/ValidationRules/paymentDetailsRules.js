import moment from 'moment';

export const VALIDATION_RULES = {
  IS_VALID_CREDIT_CARD: 'is_valid_credit_card',
  CREDIT_CARD_PROVIDER: 'credit_card_provider',
  CARD_EXP_DATE: 'card_exp_date',
  VALID_DATE_FORMAT: 'valid_date_format',
};

//   /^4[0-9]{12}(?:[0-9]{3})?$|^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
export const validateCCProvider = {
  ruleName: VALIDATION_RULES.CREDIT_CARD_PROVIDER,
  validateFunc: (value, requirement, attribute) =>
    new RegExp(
      /^4[0-9]{12}(?:[0-9]{3})?$/,
    ).test(value),
  errorMessage: 'We only accept Visa at the moment.',
};

const luhnAlgo = (ccNumber) => {
  let [firstCalc, secondCalc, toggle] = [0, 0, false];
  for (let i = ccNumber.length - 1; i >= 0; i--) {
    if (toggle) {
      let num = +ccNumber[i] * 2;
      firstCalc += num < 10 ? num : parseInt((num % 10) + num / 10, 10);
    } else {
      secondCalc += +ccNumber[i];
    }
    toggle = !toggle;
  }
  firstCalc += secondCalc;
  return firstCalc % 10 === 0;
};

export const validateCCNumber = {
  ruleName: VALIDATION_RULES.IS_VALID_CREDIT_CARD,
  validateFunc: (value, requirement, attribute) => luhnAlgo(value),
  errorMessage: 'Card number is invalid.',
};

const isExpired = (date) => {
  let [month, year] = date.split('/');
  const [thisMonth, thisYear] = moment().format('MM/YYYY').split('/');
  if (!year) {
    return false;
  }
  if (year.length === 2) {
    year = `20${year}`;

    if (year < thisYear && year.length === 4) {
      return false;
    }
    if (year === thisYear) {
      return month >= thisMonth;
    }
    return true;
  }
  return false;
};

export const validDateFormat = {
  ruleName: VALIDATION_RULES.VALID_DATE_FORMAT,
  validateFunc: (value, requirement, attribute) => {
    const dateArr = value.split('/');
    if (dateArr.length !== 2) {
      return false;
    }
    const [month, year] = dateArr;
    if (month.length !== 2 || year.length !== 2) {
      return false;
    }
    return !isNaN(month) && !isNaN(year) && month > 0 && month <= 12;
  },
  errorMessage: 'Invalid expiration date.',
};

export const futureDate = {
  ruleName: VALIDATION_RULES.CARD_EXP_DATE,
  validateFunc: (value, requirement, attribute) => isExpired(value),
  errorMessage: 'Expiration date has passed.',
};

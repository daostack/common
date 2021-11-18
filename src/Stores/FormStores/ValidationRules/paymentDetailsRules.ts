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
  validateFunc: (value: string) =>
    new RegExp(/^4[0-9]{12}(?:[0-9]{3})?$/).test(value),
  errorMessage: 'We only accept Visa at the moment.',
};

function luhnAlgo(value: string) {
  // Accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(value)) {
    return false;
  }

  // The Luhn Algorithm. It's so pretty.
  let nCheck = 0,
    bEven = false;
  value = value.replace(/\D/g, '');

  for (var n = value.length - 1; n >= 0; n--) {
    var cDigit = value.charAt(n),
      nDigit = parseInt(cDigit, 10);

    if (bEven && (nDigit *= 2) > 9) {
      nDigit -= 9;
    }

    nCheck += nDigit;
    bEven = !bEven;
  }

  return nCheck % 10 === 0;
}

export const validateCCNumber = {
  ruleName: VALIDATION_RULES.IS_VALID_CREDIT_CARD,
  validateFunc: (value: string) => luhnAlgo(value),
  errorMessage: 'Card number is invalid.',
};

const isExpired = (date: string) => {
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
  validateFunc: (value: string) => {
    const dateArr = value.split('/');
    if (dateArr.length !== 2) {
      return false;
    }
    const [month, year] = dateArr;
    if (month.length !== 2 || year.length !== 2) {
      return false;
    }
    return (
      !isNaN(Number(month)) &&
      !isNaN(Number(year)) &&
      Number(month) > 0 &&
      Number(month) <= 12
    );
  },
  errorMessage: 'Invalid expiration date.',
};

export const futureDate = {
  ruleName: VALIDATION_RULES.CARD_EXP_DATE,
  validateFunc: (value: string) => isExpired(value),
  errorMessage: 'Expiration date has passed.',
};

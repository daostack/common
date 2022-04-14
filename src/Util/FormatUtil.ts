import {MAX_CONTRIBUTION} from '~/Util/constants/paymentConstants';
import {isNumber} from 'lodash';

export const unFormatNumber = (number: string): string => {
  const lastCommaIndex = number.split('').lastIndexOf(',');
  if (
    number.includes(',') &&
    !number.includes('.') &&
    lastCommaIndex === number.length - 1
  ) {
    const integerSubstr = number.substring(0, lastCommaIndex);
    const decimalSubstr = number.substring(lastCommaIndex + 1);
    return `${integerSubstr}.${decimalSubstr}`;
  }
  return number ? number.replace(',', '') : '';
};

export const formatNumber = (number: string | number) => {
  /* The next line is making the whole formatting right, but it's not working for Android.
   * In order to make it work on Android we have to change android/build.gradle and add  `def jscFlavor = 'org.webkit:android-jsc-intl:+'`
   * Let's do it on the next build requred changes. (More info: https://github.com/lingui/js-lingui/issues/442)
   */

  // new Intl.NumberFormat('en-US').format(number);

  if (!isNumber(Number(number))) {
    return '';
  }

  let dec = '';

  if (number?.toString().includes('.')) {
    [number, dec] = number?.toString().split('.');
    dec = `.${dec}`;
  }
  number = `${parseFloat(number?.toString()).toLocaleString('en-US')}${dec}`;
  return number;
};

export const formatMoney = (num: number) =>
  Math.abs(num) > 999
    ? (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1) + 'K'
    : isLessThanThousand(num);

const isLessThanThousand = (num: number) =>
  Number.isInteger(Math.sign(num) * Math.abs(num))
    ? Math.sign(num) * Math.abs(num)
    : (Math.sign(num) * Math.abs(num)).toFixed(2);

export const formatContributionAmount = (amount: number): number => {
  if (amount >= MAX_CONTRIBUTION) {
    return MAX_CONTRIBUTION;
  }
  if (amount > 1000) {
    return Math.floor(amount / 100) * 100;
  }
  return amount;
};

export const formatMinFeeToJoin = ({
  numberValue = false,
  zeroContribution,
  minFeeToJoin,
}: {
  numberValue?: boolean;
  zeroContribution: boolean;
  minFeeToJoin: number;
}) => {
  const minValue = zeroContribution ? 0 : +minFeeToJoin;
  return !numberValue
    ? formatNumber(minValue / 100).toString()
    : (minValue / 100).toString();
};

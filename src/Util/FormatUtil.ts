export const unFormatNumber = (number: string) =>
  number ? number.replace(',', '') : '';

export const formatNumber = (number: string | number) => {
  /* The next line is making the whole formatting right, but it's not working for Android.
   * In order to make it work on Android we have to change android/build.gradle and add  `def jscFlavor = 'org.webkit:android-jsc-intl:+'`
   * Let's do it on the next build requred changes. (More info: https://github.com/lingui/js-lingui/issues/442)
   */

  // new Intl.NumberFormat('en-US').format(number);

  if (!number) {
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

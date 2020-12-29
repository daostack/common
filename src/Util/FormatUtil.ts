
export const unFormatNumber = (currValue: string) => currValue.replace(',', '');

export const formatNumber = (currValue: string | number) => {

  /* The next line is making the whole formatting right, but it's not working for Android.
     * In order to make it work on Android we have to change android/build.gradle and add  `def jscFlavor = 'org.webkit:android-jsc-intl:+'`
     * Let's do it on the next build requred changes. (More info: https://github.com/lingui/js-lingui/issues/442)
    */

  // new Intl.NumberFormat('en-US').format(currValue);
  let dec = '';

  if (currValue?.toString().includes('.')) {
    [currValue, dec] = currValue?.toString().split('.');
    dec = `.${dec}`;
  }
  currValue = `${parseFloat(currValue?.toString()).toLocaleString('en-US')}${dec}`;
  return currValue;
};

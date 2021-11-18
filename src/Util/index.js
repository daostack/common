import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens';
import logger from '~/Services/Logger';
import {LayoutAnimation} from 'react-native';
import moment from 'moment';

export const LAYOUT_ANIMATION_CONFIG = {
  duration: 300,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.scaleY,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

export const LAYOUT_ANIMATION_CONFIG_SLOW = {
  ...LAYOUT_ANIMATION_CONFIG,
  duration: 450,
};

export const numberFormatter = (num) => {
  const denom = Math.abs(Number(num));
  return denom >= 1.0e9
    ? denom / 1.0e9 + 'B'
    : // Six Zeroes for Millions
    denom >= 1.0e6
    ? denom / 1.0e6 + 'M'
    : // Three Zeroes for Thousands
    denom >= 1.0e4
    ? denom / 1.0e4 + 'K'
    : denom;
};

export function filterObjectByKeys(currObj, allowedKeys) {
  return Object.keys(currObj)
    .filter((key) => allowedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = currObj[key];
      return obj;
    }, {});
}

// This function requires the bottomSheetStore as a variable as you can't
// access the mobx store outside of a react component
export const showErrorPopUp = (bottomSheetStore, arg) => {
  if (arg instanceof Error) {
    const errorObj = getErrorObject(arg);

    bottomSheetStore.showBottomSheet(BOTTOM_SHEET.TRANSACTION_ERROR, {
      errorMessage: errorObj.errorMessage,
      errorId: errorObj.errorId,
      errorObj,
    });
  } else {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET.TRANSACTION_ERROR, {
      errorMessage: arg,
    });
  }
};

// This function requires the bottomSheetStore as a variable as you can't
// access the mobx store outside of a react component
export const showLoadingExpirationPopUp = (
  bottomSheetStore,
  errorMessage,
  navigation,
) => {
  bottomSheetStore.showBottomSheet(BOTTOM_SHEET.LOADING_EXPIRED, {
    errorMessage,
    navigation,
  });
};

// This function requires the bottomSheetStore as a variable as you can't
// access the mobx store outside of a react component
export const showBackendError = ({bottomSheetStore, subTitle = null}) => {
  bottomSheetStore.showBottomSheet(BOTTOM_SHEET.BACKEND_ERROR, {
    subTitle:
      subTitle || 'This took longer than expected, please try again later',
    shouldGoBack: true,
  });
};

export const getErrorObject = (axiosError) => {
  try {
    return axiosError.response.data;
  } catch (e) {
    logger.error('Something went wrong trying to parse the error object', e);
    logger.error('Error object: ', axiosError);

    return {
      errorMessage: 'Something bad happened',
      errorId: 'Cannot retrieve the ID if the error',
      errorCode: 500,
    };
  }
};

export const isDaoMemberByUserId = (members, userUID) => {
  if (!members) {
    return false;
  }
  return members.some((member) => member.userId === userUID);
};

export const formatNumber = (num) =>
  Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'K'
    : Math.sign(num) * Math.abs(num);

export const formatCurrency = (amount) => {
  const formattedAmount = (amount / 100)
    .toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    // If the amount is whole number don't show the centes
    .split('.00')[0];

  return formattedAmount.indexOf('$') === -1
    ? `$${formattedAmount}`
    : formattedAmount;
};

export const escapeUrl = (linkArr) =>
  linkArr?.map((link) => {
    link.value = encodeURI(link.value.trim());
    return link;
  });

export const formatDate = (date) => moment(date).format('DD MMMM YYYY');

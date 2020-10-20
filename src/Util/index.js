import {BOTTOM_SHEET_TEMPLATES} from '~/Stores/BottomSheetStore';
import logger from '~/Services/Logger';

import moment from 'moment';

export const GOOGLE_SIGNIN_PERMISSIONS = {
  DRIVE_RW: 'https://www.googleapis.com/auth/drive',
  APP_DATA_RW: 'https://www.googleapis.com/auth/drive.appdata',
};

export const AUTH_PROVIDER_ID = {
  APPLE: 'apple.com',
  GOOGLE: 'google.com',
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
        : Math.floor(denom);
};

export function prepareUserObject(user) {
  if (!user) {
    return null;
  }

  let displayName = user.firstName ? user.firstName : null;
  if (user.lastName) {
    displayName = (displayName ? `${displayName} ` : '') + user.lastName;
  }
  return {...user, ... {displayName}};
}

export function filterObjectByKeys(currObj, allowedKeys) {
  return Object.keys(currObj)
    .filter((key) => allowedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = currObj[key];
      return obj;
    }, {});
}

export const calcIsFundingStage = (deadline) => {
  const deadlineMoment = moment.unix(deadline);
  return !moment().isAfter(deadlineMoment);
};


// This function requires the bottomSheetStore as a variable as you can't
// access the mobx store outside of a react component
export const showErrorPopUp = (bottomSheetStore, arg) => {
  if (arg instanceof Error) {
    const errorObj = getErrorObject(arg);

    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.TRANSACTION_ERROR, {
      errorMessage: errorObj.errorMessage,
      errorId: errorObj.errorId,
      errorObj,
    });
  } else {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.TRANSACTION_ERROR, {
      errorMessage: arg,
    });
  }
};

export const getErrorObject = (axiosError) => {
  try {
    return axiosError.response.data;
  } catch (e) {
    logger.error('Something went wrong trying to parse the error object', e);

    return {
      errorMessage: 'Something bad happened',
      errorId: 'Cannot retrieve the ID if the error',
      errorCode: 500,
    };
  }
};

export const isDaoMemberBySafeAddress = (members, userSafeAddress) => {
  if (!members) {
    return false;
  }
  return members.some(
    (member) =>
      member.address === userSafeAddress?.toLowerCase()
  );
};

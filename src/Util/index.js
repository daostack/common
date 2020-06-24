import {BOTTOM_SHEET_TEMPLATES} from '../Stores/BottomSheetStore';
import moment from 'moment';
const googleServicesData = require('../../android/app/google-services.json');

export const GOOGLE_SIGNIN_PERMISSIONS = {
  APP_DATA_RW: 'https://www.googleapis.com/auth/drive.appdata',
};

export const WEB_CLIENT_ID =
  googleServicesData.client[0].services.appinvite_service
    .other_platform_oauth_client[0].client_id;

export const numberFormatter = num => {
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

export function filterObjectByKeys(currObj, allowedKeys) {
  return Object.keys(currObj)
    .filter(key => allowedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = currObj[key];
      return obj;
    }, {});
}

export const getTestEth = address =>
  fetch(
    `https://us-central1-common-daostack.cloudfunctions.net/api/send-test-eth/${address}`,
  );

export const calcIsFundingStage = (deadline) => {
  const deadlineMoment = moment.unix(deadline);
  return !moment().isAfter(deadlineMoment);
};


export const showErrorPopUp = (bottomSheetStore, message) => {
  /* this function requires the bottomSheetStore as a variable as you can't
  access the mobx store outside of a react component */
  bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.TRANSACTION_ERROR, {errorMessage: message});
};

import axios from 'axios';
import {mangoPayUrl} from '~/Config';
import auth from '@react-native-firebase/auth';
const qs = require('qs');

const axiosClient = axios.create({
  baseURL: mangoPayUrl(),
  // or for development:
  //baseURL: 'http://localhost:5001/common-daostack/us-central1/mangopay/',
  timeout: 1000000, // milliseconds
});

export const preauthorizePayment = async (cardData, funding, navigation) => {
  try {
    const idToken = await auth().currentUser.getIdToken();
    // first create the user in mangopay if isn't already created
    await axiosClient.post('create-user', {idToken});
    // then get card pre-registration data
    const {
      data: {preRegData},
    } = await axiosClient.post('get-card-registration', {idToken});

    const {
      Id,
      PreregistrationData,
      AccessKey,
      CardRegistrationURL,
    } = preRegData;

    const cardInfo = {
      data: PreregistrationData,
      accessKeyRef: AccessKey,
      cardNumber: cardData.cardNumber,
      cardExpirationDate: cardData.expDate,
      cardCvx: cardData.cvv,
    };
    // post card sensitive data directly to tokenization server
    const cardRegistrationData = await axios.post(
      CardRegistrationURL,
      qs.stringify(cardInfo),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    // finalize the card registration - save cardId to firebase and preauthorize payment
    const {
      data: {
        preAuthData: {preAuthId, SecureModeRedirectURL},
      },
    } = await axiosClient.post('register-card', {
      idToken,
      cardRegistrationData,
      Id,
      funding,
    });
    if (SecureModeRedirectURL) {
      const is3DCheckFinished = () =>
        new Promise((resolve, reject) => {
          navigation.navigate('Browser', {
            url: SecureModeRedirectURL,
            onNavStateChange: (e) => {
              if (e.url.indexOf('common.io') > -1) {
                navigation.pop();
                resolve();
              }
            },
            onBack: () => resolve(),
          });
        });
      await is3DCheckFinished();
      const {
        data: {Status},
      } = await axiosClient.post('get-preauthorisation-status', {preAuthId});
      if (Status === 'SUCCEEDED') {
        return preAuthId;
      } else {
        throw new Error('3D Authentication failed');
      }
    }
    return preAuthId;
  } catch (e) {
    console.log(e);
    console.log(e.response?.data);
    throw e;
  }
};

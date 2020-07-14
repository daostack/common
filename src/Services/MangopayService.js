import axios from 'axios';
import { mangoPayUrl } from '../Config';
import auth from '@react-native-firebase/auth';
const qs = require('qs');


const axiosClient = axios.create({
  baseURL: mangoPayUrl,
  // or for development:
  //baseURL: 'http://localhost:5001/common-daostack/us-central1/mangopay/',
  timeout: 1000000, // milliseconds
});

export const preauthorizePayment = async (cardData, funding) => {
  try {
    const idToken = await auth().currentUser.getIdToken();
    // first create the user in mangopay if isn't already created
    await axiosClient.post('create-user', { idToken });
    // then get card pre-registration data
    const { data: { preRegData}} = await axiosClient.post(
      'pre-reg-data',
      { idToken },
    );

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
    const cardRegistrationResult = await axios.post(CardRegistrationURL, qs.stringify(cardInfo), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // finalize the card registration - save cardId to firebase and preauthorize payment
    const {data: {preAuthData: {preAuthId}}} = await axiosClient.post('finalize-card-reg',
      { idToken, cardRegistrationResult, Id, funding  }
    );
    return preAuthId;
  } catch (e) {
    console.log(e);
    console.log(e.response);
    throw e;
  }
};



/* export const registerCard = async () => {

}; */

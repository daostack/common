import axios from 'axios';
import { mangoPayUrl } from '../Config';
import auth from '@react-native-firebase/auth';


const axiosClient = axios.create({
  //baseURL: mangoPayUrl,
  // or for development:
  baseURL: 'http://localhost:5001/common-daostack/us-central1/mangopay/',
  timeout: 1000000, // milliseconds
});

export const preauthorizePayment = async (cardData) => {
  try {
    const idToken = await auth().currentUser.getIdToken();
    const response = await axiosClient.post(
      'create-user',
      { idToken },
    );

    const { data: { preRegData}} = await axiosClient.post(
      'pre-reg-data',
      { idToken },
    );

    console.log(preRegData);

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

    const postCardInfo = await axios.post(CardRegistrationURL, cardInfo, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('postcardInfo', postCardInfo);

  } catch (e) {
    console.log(e);
    console.log(e.response);
    throw e;
  }
};



/* export const registerCard = async () => {

}; */

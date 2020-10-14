import axios from 'axios';
import {circlePayUrl} from '~/Config';
import auth from '@react-native-firebase/auth';
var base64 = require('base-64');
import OpenPGP from 'react-native-fast-openpgp';

const axiosClient = axios.create({
  baseURL: circlePayUrl(),
  timeout: 1000000,
});

const getEncryptedData = async (dataToEncrypt) => {
  const {data} = await axiosClient.get('encryption');
  const {keyId, publicKey} = data.data;
  let decodedPublicKey = base64.decode(publicKey);
  return OpenPGP.encrypt(JSON.stringify(dataToEncrypt), decodedPublicKey).then((ciphertext) => (
    {
      encryptedData: base64.encode(ciphertext),
      keyId: keyId,
    }
  ));
};

const cardData = (formData) => ({
  billingDetails: {
    name: formData.card_name,
    city: formData.City,
    country: 'US', //formData.Country,  //Country portion of the address. Formatted as a two-letter country code specified in ISO 3166-1 alpha-2.
    line1: 'line1', //formData.Address,
    postalCode: '11111', //formData.PostalCode,
    district: 'MA', //formData.District, //optional //format: 'MA', State / County / Province / Region portion of the address. If the country is US or Canada district is required and should use the two-letter code for the subdivision.
  },
  expMonth: +formData.expiration_date.split('/')[0],
  expYear: +(`20${formData.expiration_date.split('/')[1]}`),
  metadata: {
    email: formData.email,
  },
});

export const createCard = async (formData, proposalId) => {
  try {
    const idToken = await auth().currentUser.getIdToken();
    const {encryptedData, keyId} = await getEncryptedData({number: `${formData.card_number}`, cvv: `${formData.cvv}`});
    await axiosClient.post('create-card',{idToken, ...cardData(formData), keyId, encryptedData, proposalId});
  } catch (e) {
    console.log('error', e);
    throw e;
  }
};

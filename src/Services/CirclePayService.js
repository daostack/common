import axios from 'axios';
import {circlePayUrl} from '~/Config';
import auth from '@react-native-firebase/auth';
var base64 = require('base-64');
import OpenPGP from 'react-native-fast-openpgp';

const axiosClient = axios.create({
  baseURL: circlePayUrl(),
  timeout: 1000000,
});

const endpoints = {
  assign: '/assign-card',
  create: '/create-card',
};

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
    city: 'Test City',
    country: 'US',
    line1: 'Test',
    postalCode: '11111',
    district: 'MA',
  },
  expMonth: +formData.expiration_date.split('/')[0],
  expYear: +(`20${formData.expiration_date.split('/')[1]}`),
  metadata: {
    email: formData.email,
  },
});

export const createCard = async (formData) => {
  const idToken = await auth().currentUser.getIdToken();

  const {encryptedData, keyId} = await getEncryptedData({
    number: `${formData.card_number}`,
    cvv: `${formData.cvv}`,
  });

  return (await axiosClient.post(endpoints.create, {
    keyId,
    idToken,
    encryptedData,
    ...cardData(formData),
  })).data;
};

export const assignCard = async (cardId, proposalId) => {
  const idToken = await auth().currentUser.getIdToken();

  return await axiosClient.post(endpoints.assign, {
    proposalId,
    idToken,
    cardId,
  });
};

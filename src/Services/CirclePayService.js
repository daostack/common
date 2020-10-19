import axios from 'axios';
import {circlePayUrl} from '~/Config';
import auth from '@react-native-firebase/auth';
import OpenPGP from 'react-native-fast-openpgp';

var base64 = require('base-64');

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
    city: formData.City,
    country: formData.Country,
    line1: formData.Address,
    postalCode: formData.PostalCode,
    district: formData.District,
  },
  expMonth: +formData.expiration_date.split('/')[0],
  expYear: +(`20${formData.expiration_date.split('/')[1]}`),
  metadata: {
    email: formData.email,
  },
});

export const createCard = async (formData) => (await axiosClient.post(endpoints.create, createCardPayload(formData))).data;

export const createCardPayload = async (formData) => {
  const idToken = await auth().currentUser.getIdToken();

  const {encryptedData, keyId} = await getEncryptedData({
    number: `${formData.card_number}`,
    cvv: `${formData.cvv}`,
  });

  return {
    keyId,
    idToken,
    encryptedData,
    ...cardData(formData),
  };
};

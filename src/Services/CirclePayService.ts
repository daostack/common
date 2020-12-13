import axios from 'axios';
import {circlePayUrl} from '~/Config';
import {auth} from '../Firebase';
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

const getEncryptedData = async (token: string, dataToEncrypt: {number: string, cvv: string}) => {
  const {data} = await axiosClient.get('encryption', {
    headers: {
      Authorization: token,
    },
  });
  const {keyId, publicKey} = data.data;
  let decodedPublicKey = base64.decode(publicKey);
  return OpenPGP.encrypt(JSON.stringify(dataToEncrypt), decodedPublicKey).then((ciphertext) => (
    {
      encryptedData: base64.encode(ciphertext),
      keyId: keyId,
    }
  ));
};

interface ICardFormData {
  card_name: string,
  City: string,
  Country: string,
  Address: string,
  PostalCode: string,
  District?: string,
  expiration_date: string,
  email: string,
  card_number: string,
  cvv: string
}

const cardData = (formData: ICardFormData) => ({
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

export const createCard = async (formData: ICardFormData) => (
  await axiosClient.post(endpoints.create, await createCardPayload(formData), {
    headers: {
      Authorization: await auth().currentUser.getIdToken(true),
    },
  }));

export const createCardPayload = async (formData: ICardFormData) => {
  const idToken = await auth().currentUser.getIdToken(true);

  const {encryptedData, keyId} = await getEncryptedData(idToken,
    {
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

import {axiosCircleClient} from '~/Config/network';
import {auth} from '~/Firebase';
import OpenPGP from 'react-native-fast-openpgp';

const base64 = require('base-64');

const endpoints = {
  assign: '/assign-card',
  create: '/create-card',
};

type CardFormData = {
  CardName: string;
  City: string;
  Country: string;
  Address: string;
  PostalCode: string;
  District: string;
  expiration_date: string;
  card_number: string;
  cvv: string;
};

type CardData = {
  billingDetails: {
    name: string;
    city: string;
    country: string;
    line1: string;
    postalCode: string;
    district: string;
  };
  expMonth: number;
  expYear: number;
};

interface EncryptedCardData {
  encryptedData: string;
  keyId: string;
}

const getEncryptedData = async (
  token: string,
  dataToEncrypt: {number: string; cvv: string},
): Promise<EncryptedCardData> => {
  const {data} = await axiosCircleClient.get('encryption', {
    headers: {
      Authorization: token,
    },
  });
  const {keyId, publicKey} = data.data;
  let decodedPublicKey = base64.decode(publicKey);
  return OpenPGP.encrypt(JSON.stringify(dataToEncrypt), decodedPublicKey).then(
    (ciphertext) => ({
      encryptedData: base64.encode(ciphertext),
      keyId: keyId,
    }),
  );
};

const cardData = (formData: CardFormData): CardData => ({
  billingDetails: {
    name: formData.CardName,
    city: formData.City,
    country: formData.Country,
    line1: formData.Address,
    postalCode: formData.PostalCode,
    district: formData.District,
  },
  expMonth: +formData.expiration_date.split('/')[0],
  expYear: +`20${formData.expiration_date.split('/')[1]}`,
});

export const createCard = async (formData: CardFormData) => {
  const card = await createCardPayload(formData);

  return (
    await axiosCircleClient.post(endpoints.create, card, {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    })
  ).data;
};

export const createCardPayload = async (formData: CardFormData) => {
  const idToken = await auth().currentUser.getIdToken(true);

  const {encryptedData, keyId} = await getEncryptedData(idToken, {
    number: `${formData.card_number}`,
    cvv: `${formData.cvv}`,
  });

  return {
    keyId,
    encryptedData,
    ...cardData(formData),
  };
};

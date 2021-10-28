import axios, {AxiosInstance} from 'axios';
import {auth} from '~/Firebase';
import OpenPGP from 'react-native-fast-openpgp';
import {circlePayUrl} from '~/Config';

const base64 = require('base-64');

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

class CirclePayService {
  private axiosClient: AxiosInstance;
  private endpoints: {assign: string; create: string};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: circlePayUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      assign: '/assign-card',
      create: '/create-card',
    };
  }

  getEncryptedData = async (
    token: string,
    dataToEncrypt: {number: string; cvv: string},
  ): Promise<EncryptedCardData> => {
    const {data} = await this.axiosClient.get('encryption', {
      headers: {
        Authorization: token,
      },
    });
    const {keyId, publicKey} = data.data;
    let decodedPublicKey = base64.decode(publicKey);
    return OpenPGP.encrypt(
      JSON.stringify(dataToEncrypt),
      decodedPublicKey,
    ).then((ciphertext) => ({
      encryptedData: base64.encode(ciphertext),
      keyId: keyId,
    }));
  };

  cardData = (formData: CardFormData): CardData => ({
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

  createCard = async (formData: CardFormData) => {
    const card = await this.createCardPayload(formData);

    return (
      await this.axiosClient.post(this.endpoints.create, card, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      })
    ).data;
  };

  createCardPayload = async (formData: CardFormData) => {
    const idToken = await auth().currentUser.getIdToken(true);

    const {encryptedData, keyId} = await this.getEncryptedData(idToken, {
      number: `${formData.card_number}`,
      cvv: `${formData.cvv}`,
    });

    return {
      keyId,
      encryptedData,
      ...this.cardData(formData),
    };
  };
}

export default new CirclePayService();

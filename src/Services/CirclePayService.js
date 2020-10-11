import axios from 'axios';
import {circlePayUrl} from '~/Config';
import auth from '@react-native-firebase/auth';
var base64 = require('base-64');
import * as openpgp from 'react-native-fast-openpgp';

const axiosClient = axios.create({
  baseURL: circlePayUrl(),
  timeout: 1000000,
});

const getEncryptedData = async (dataToEncrypt) => {
  const {data} = await axiosClient.get('encryption');
  const {keyId, publicKey} = data.data;
  let decodedPublicKey = base64.decode(publicKey);

  //this causes an unprocessable entity for encrypted data:
  //'message', 'key', and 'encrypt' are undefined here, maybe only on staging & dev?
  const options = {
    message: openpgp.message.fromText(JSON.stringify(dataToEncrypt)),
    publicKeys: (await openpgp.key.readArmored(decodedPublicKey)).keys,
  };

  return openpgp.encrypt(options).then((ciphertext) => (
    {
      encryptedData: base64.encode(ciphertext.data),
      keyId: keyId,
    }
  ));
};

const cardData = (formData) => ({
  billingDetails: {
    name: 'Customer 0002',
    city: 'Test City',
    country: 'US',
    line1: 'Test',
    postalCode: '11111',
    district: 'MA',
  },
  expMonth: +formData.expiration_date.split('/')[0],
  expYear: +(`20${formData.expiration_date.split('/')[1]}`),
  metadata: {
    email: 'customer-0002@circle.com',
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

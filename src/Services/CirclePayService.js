import axios from 'axios';
import {circlePayUrl} from '~/Config';
import auth from '@react-native-firebase/auth';
import base64 from 'react-native-base64';
// import * as openpgp from 'react-native-openpgp'; //use this one instead?
const openpgp = require('openpgp');
const qs = require('qs');

const axiosClient = axios.create({
  baseURL: circlePayUrl(),
  timeout: 1000000,
});

const getEncryptedData = async (dataToEncrypt) => {
  const {data} = await axiosClient.get('encryption');
  const {keyId, publicKey} = data.data;
  const decodedPublicKey = base64.decode(publicKey.trim());

  const options = {
    message: openpgp.message.fromText(JSON.stringify(dataToEncrypt)),
    publicKeys: (await openpgp.key.readArmored(decodedPublicKey)).keys,
  };
  // console.log('options', options);

  return openpgp.encrypt(options).then((ciphertext) => (
    {
      encryptedData: base64.encode(ciphertext.data),
      keyId: keyId,
    }
  ));
};

export const createCard = async (cardData, fundind, navigation) => {
  try {
    const idToken = await auth().currentUser.getIdToken();
    const encryptedData = await getEncryptedData(cardData.encryptedData);
    cardData.encryptedData = encryptedData;
    // console.log('cardData ', cardData);

    /* following lines (and the web client example) results in error: status 422, statusText: Unprocessable Entity
    message API parameter invalid: Encrypted data contains unprocessable entity*/
    // const response = await axiosClient.post('create-card', {idToken, keyId: encryptedData.keyId, ...cardData});
    // console.log('response', response.data);
    return; ///response.data;
  } catch (e) {
    console.log('error', e);
    throw e;
  }

};

export const ping = async () => {
  axios.get('https://api-sandbox.circle.com/ping').then(async (resp) => {
  }).catch(async (e) => {
    console.log('e', e);
  });
};


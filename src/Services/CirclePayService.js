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

export const createCard = async (cardData, dataToEncrypt, proposalId) => {
  try {
    const idToken = await auth().currentUser.getIdToken();
    const {encryptedData, keyId} = await getEncryptedData(dataToEncrypt);
    await axiosClient.post('create-card',{idToken, ...cardData, keyId, encryptedData, proposalId});
  } catch (e) {
    console.log('error', e);
    throw e;
  }
};

import axios from 'axios';
import {circlePayUrl} from '~/Config';
import {mangoPayUrl} from '~/Config';
import auth from '@react-native-firebase/auth';
const qs = require('qs');

const axiosClient = axios.create({
  baseURL: circlePayUrl(),
  timeout: 1000000,
});

export const createCard = async (cardData, fundind, navigation) => {
  try {
    const idToken = await auth().currentUser.getIdToken();
    await axiosClient.post('create-card', {idToken, ...cardData});
    return 'createCard';

  } catch (e) {
    console.log('eee', e);
    throw e;
  }

};

export const ping = async () => {
  axios.get('https://api-sandbox.circle.com/ping').then(async (resp) => {
  }).catch(async (e) => {
    console.log('e', e);
  });
};


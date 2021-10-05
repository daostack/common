import axios from 'axios';
import {circlePayUrl} from '~/Config';
import {auth} from '~/Firebase';
import OpenPGP from 'react-native-fast-openpgp';

import {apollo} from '~/Util/helpers/apolloHelper';
import {getGQLErrorObject} from '~/Util';
import logger from '~/Services/Logger';

import {CreateCardDocument} from '~/Graphql/Card';

var base64 = require('base-64');

const axiosClient = axios.create({
  baseURL: circlePayUrl(),
  timeout: 1000000,
});

// TODO: replace with call to new backend when API is ready.
const getEncryptedData = async (token, dataToEncrypt) => {
  const {data} = await axiosClient.get('encryption', {
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

const cardData = (formData) => ({
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

export const createCard = async (formData) => {
  try {
    const cardPayload = await createCardPayload(formData);
    return await apollo.mutate({
      mutation: CreateCardDocument,
      variables: {
        createCard: cardPayload,
      },
    });
  } catch (err) {
    logger.log(
      'Error while trying to create a new Card: ',
      getGQLErrorObject(err),
    );
    throw err;
  }
};

export const createCardPayload = async (formData) => {
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

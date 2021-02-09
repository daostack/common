import axios from 'axios';
import {commonsUrl} from '~/Config';

export const axiosClient = (function () {
  let commonClient = {
    endpoints: {
      create: '/create',
      update: '/update',
    },
  };

  const createCommonInstance = () => {
    commonClient.instance = axios.create({
      baseURL: commonsUrl(),
      timeout: 1000000,
    });
  };

  return {
    getCommonClient: () => {
      if (!commonClient.instance) {
        commonClient.instance = createCommonInstance();
      }
      return commonClient.instance;
    },
    getCommonEndpoints: () => commonClient.endpoints,
  };
})();

import axios from 'axios';
import {discussionsUrl} from '~/Config';

export const axiosClient = (function () {
  let commonClient = {
    endpoints: {
      update: '/update',
    },
  };

  const createDiscussionInstance = () => {
    commonClient.instance = axios.create({
      baseURL: discussionsUrl(),
      timeout: 1000000,
    });
  };

  return {
    getDiscussionClient: () => {
      if (!commonClient.instance) {
        commonClient.instance = createDiscussionInstance();
      }
      return commonClient.instance;
    },
    getDiscussionEndpoints: () => commonClient.endpoints,
  };
})();

import axios from 'axios';
import {commonsUrl, discussionsUrl} from '~/Config';

export const axiosDiscussionClient = (function () {
  let commonClient = {
    endpoints: {
      create: '/create',
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
        createDiscussionInstance();
      }
      return commonClient.instance;
    },
    getDiscussionEndpoints: () => commonClient.endpoints,
  };
})();

export const axiosCommonClient = (function () {
  let commonClient = {
    endpoints: {
      create: '/create',
      update: '/update',
    },
  };

  const createCommonInstance = () => {
    commonClient.instance = axios.create({
      baseURL: commonsUrl(),
    });
  };

  return {
    getCommonClient: () => {
      if (!commonClient.instance) {
        createCommonInstance();
      }
      return commonClient.instance;
    },
    getCommonEndpoints: () => commonClient.endpoints,
  };
})();

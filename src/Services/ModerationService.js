import axios from 'axios';
import {moderationUrl} from '~/Config';
import {auth} from '~/Firebase';

export default class ModerationService {
  static serviceInstance = null;

    constructor() {

    this.axiosClient = axios.create({
      baseURL: moderationUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      hide: '/hide',
      hideReport: '/hide-report',
    };
  }

  static getInstance = () => {
    if (ModerationService.serviceInstance == null) {
      ModerationService.serviceInstance = new ModerationService();
    }
    return this.serviceInstance;
  };

  hide = async (type, commonId, moderation = null, report = false) => {
    try {
      return await this.axiosClient.post(
        this.endpoints.hide,
        {
          moderation,
          commonId,
          type,
        },
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  show = async (moderation, commonId, type, report = false) => {
    try {
      return await this.axiosClient.post(
        this.endpoints.hide,
        {
          moderation,
          commonId,
          type,
        },
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }
}


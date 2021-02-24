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
      report: '/report',
      show: '/show',
    };
  }

  static getInstance = () => {
    if (ModerationService.serviceInstance == null) {
      ModerationService.serviceInstance = new ModerationService();
    }
    return this.serviceInstance;
  };

  hide = async (itemId, type, commonId) => {
    try {
      return await this.axiosClient.post(
        this.endpoints.hide,
        {
          itemId,
          commonId,
          type,
        },
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        },
      );
    } catch (error) {
      throw error;
    }
  };

  report = async (type, commonId, moderationData) =>
    await this.axiosClient.post(
      this.endpoints.report,
      {
        moderationData,
        commonId,
        type,
      },
      {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      },
    );

  show = async (itemId, commonId, type) =>
    await this.axiosClient.post(
      this.endpoints.show,
      {
        itemId,
        commonId,
        type,
      },
      {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      },
    );
}

import axios, {AxiosInstance} from 'axios';
import {ACTIONS, ENTITY_TYPES} from '~/Components/Moderation/constants';
import {moderationUrl} from '~/Config';
import {auth} from '~/Firebase';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import Toast from '~/Util/Toast.js';

class ModerationService {
  private axiosClient: AxiosInstance;
  private endpoints: {hide: string; report: string; show: string};

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

  async hide(
    itemId: string,
    type: keyof typeof ENTITY_TYPES,
    commonId: string,
  ): Promise<IDiscussionEntity | IDiscussionMessageEntity | IProposalEntity> {
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
  }

  async report(
    type: keyof typeof ENTITY_TYPES,
    commonId: string,
    moderationData: Record<string, string>,
  ): Promise<void> {
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
  }

  show = async (
    itemId: string,
    commonId: string,
    type: keyof typeof ENTITY_TYPES,
  ): Promise<void> =>
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

  onModerate = async (
    actionType: keyof typeof ACTIONS,
    itemId: string,
    commonId: string,
    itemType: keyof typeof ENTITY_TYPES,
  ): Promise<boolean | string> => {
    try {
      switch (actionType) {
        case ACTIONS.show:
          Toast.loading('Loading...');
          await this.show(itemId, commonId, itemType);
          Toast.hide();
          Toast.success('Done');
          return true;
        case ACTIONS.hide:
          Toast.loading('Hiding content...');
          await this.hide(itemId, itemType, commonId);
          Toast.hide();
          Toast.success('Done');
          return true;
        default:
          // reporting
          return ACTIONS.report;
      }
    } catch (error) {
      Toast.hide();
      Toast.error(`Could not ${actionType.toLowerCase()} content`);
      return false;
    }
  };
}

export default new ModerationService();

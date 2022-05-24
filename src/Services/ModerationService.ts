import Clipboard from '@react-native-clipboard/clipboard';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import axios, {AxiosInstance} from 'axios';
import Share from 'react-native-share';
import {ACTIONS, ENTITY_TYPES} from '~/Components/Moderation/constants';
import {moderationUrl} from '~/Config';
import {auth} from '~/Firebase';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import logger from '~/Services/Logger';
import {DYNAMIC_LINK_URI_PREFIX} from '~/Util/constants/dynamicLinks';
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
    moderationData: Record<string, string>,
  ): Promise<void> {
    let token = auth().currentUser
      ? await auth().currentUser.getIdToken(true)
      : null;


    await this.axiosClient.post(
      this.endpoints.report,
      {
        moderationData,
        ...(auth().currentUser?.uid && {userId: auth().currentUser?.uid}),
        type,
      },
      {
        ...(token && {
          headers: {
            Authorization: token,
          },
        }),
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

  copyLink = async (
    itemId: string,
    type: keyof typeof ENTITY_TYPES,
  ): Promise<void> => {
    try {
      const url = await dynamicLinks().buildShortLink({
        link: `${DYNAMIC_LINK_URI_PREFIX}/${type}/${itemId}`,
        domainUriPrefix: DYNAMIC_LINK_URI_PREFIX,
      });
      Clipboard.setString(url);
    } catch (err) {
      logger.log('Deep Linking works only in production');
    }
  };

  share = async (
    itemId: string,
    type: keyof typeof ENTITY_TYPES,
  ): Promise<void> => {
    try {
      const url = await dynamicLinks().buildShortLink({
        link: `${DYNAMIC_LINK_URI_PREFIX}/${type}/${itemId}`,
        domainUriPrefix: DYNAMIC_LINK_URI_PREFIX,
      });
      const options = {
        url,
        message: 'Download the Common app to join now.',
      };
      Share.open(options);
    } catch (err) {
      logger.log('Deep Linking works only in production');
    }
  };

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
        case ACTIONS.copyLink:
          this.copyLink(itemId, itemType);
          Toast.success('Link copied to clipboard');
          return false;
        case ACTIONS.share:
          this.share(itemId, itemType);
          return false;
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

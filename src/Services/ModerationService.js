import axios from 'axios';
import {moderationUrl} from '~/Config';
import {auth} from '~/Firebase';
import {ACTIONS} from '~/Components/Moderation/constants';
import {CreateReportDocument, REPORT_TYPE} from '~/Graphql/Report';
import Toast from '~/Util/Toast.js';
import {apollo} from '~/Util/helpers/apolloHelper';

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

  report = async ({type, moderationData}) => {
    const reportData = {
      type,
      for: moderationData.reasons,
      note: moderationData.moderatorNote,
      ...(type === REPORT_TYPE.ProposalReport && {
        proposalId: moderationData.itemId,
      }),
      ...(type === REPORT_TYPE.MessageReport && {
        messageId: moderationData.itemId,
      }),
    };

    const {data} = await apollo.mutate({
      mutation: CreateReportDocument,
      variables: {input: reportData},
    });

    return data.createReport;
  };

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

  onModerate = async (actionType, itemId, commonId, itemType) => {
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

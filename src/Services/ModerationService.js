import {ACTIONS} from '~/Components/Moderation/constants';
import {CreateReportDocument, REPORT_FLAG, REPORT_TYPE} from '~/Graphql/Report';
import {apollo} from '~/Util/helpers/apolloHelper';
import Toast from '~/Util/Toast.js';
import {
  changeDiscussionFlag,
  changeDiscussionMessageFlag,
  changeProposalFlag,
} from './ListServices/ReportService';

export default class ModerationService {
  static serviceInstance = null;

  static getInstance = () => {
    if (ModerationService.serviceInstance == null) {
      ModerationService.serviceInstance = new ModerationService();
    }
    return this.serviceInstance;
  };

  hide = async (itemId, type) => {
    try {
      switch (type) {
        case REPORT_TYPE.DiscussionReport:
          return await changeDiscussionFlag(itemId, REPORT_FLAG.Hidden);
        case REPORT_TYPE.MessageReport:
          return await changeDiscussionMessageFlag(itemId, REPORT_FLAG.Hidden);
        case REPORT_TYPE.ProposalReport:
          return await changeProposalFlag(itemId, REPORT_FLAG.Hidden);
      }

      return Promise.reject();
    } catch (error) {
      throw error;
    }
  };

  report = async ({type, moderationData}) => {
    const reportData = {
      type,
      for: moderationData.reasons.replace(/ /g, '').split(','),
      note: moderationData.moderatorNote,
      ...(type === REPORT_TYPE.DiscussionReport && {
        discussionId: moderationData.itemId,
      }),
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

  show = async (itemId, type) => {
    try {
      switch (type) {
        case REPORT_TYPE.DiscussionReport:
          return await changeDiscussionFlag(itemId, REPORT_FLAG.Clear);
        case REPORT_TYPE.MessageReport:
          return await changeDiscussionMessageFlag(itemId, REPORT_FLAG.Clear);
        case REPORT_TYPE.ProposalReport:
          return await changeProposalFlag(itemId, REPORT_FLAG.Clear);
      }

      return Promise.reject();
    } catch (error) {
      throw error;
    }
  };

  onModerate = async (actionType, itemId, itemType) => {
    try {
      switch (actionType) {
        case ACTIONS.show:
          Toast.loading('Loading...');
          await this.show(itemId, itemType);
          Toast.hide();
          Toast.success('Done');
          return true;
        case ACTIONS.hide:
          Toast.loading('Hiding content...');
          await this.hide(itemId, itemType);
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

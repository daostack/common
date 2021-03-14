import {observable, computed} from 'mobx';
import {
  EventTypeState,
  INotificationEntity,
  NotificationItemData,
  IProposalNotificationData,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import RootStore from '../RootStore';
import {BaseModel} from './BaseModel';
import logger from '~/Services/Logger';
import {IFundingRequestDescription} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {Proposal} from './Proposal';

export class Notification extends BaseModel<INotificationEntity> {
  @observable
  rootStore: RootStore;

  @observable
  id: string;

  @observable
  eventObjectId: string;

  @observable
  eventType: string;

  @observable
  userFilter: Array<string>;

  @computed
  get notificationItemData(): NotificationItemData {
    try {
      switch (this.eventType) {
        case EventTypeState.commonWhitelisted:
        case EventTypeState.commonCreated:
          return this.getCommonWhitelistedData();

        case EventTypeState.fundingRequestCreated:
        case EventTypeState.fundingRequestAccepted:
        case EventTypeState.fundingRequestExecuted:
        case EventTypeState.fundingRequestRejected:
          return this.getFundingRequestData();

        case EventTypeState.messageCreated:
          return this.getMessageCreatedData();

        case EventTypeState.requestToJoinAccepted:
          return this.getReqToJoinAcceptedData();

        case EventTypeState.requestToJoinCreated:
          return this.getReqToJoinCreatedData();

        case EventTypeState.requestToJoinRejected:
          return this.getReqToJoinRejectedData();
      }
    } catch (err) {
      logger.warn(
        `NOT EXISTING Object data with id: ${this.eventObjectId} and type ${this.eventType}`,
      );
    }

    return {missingData: true} as NotificationItemData;
  }

  private getCommonWhitelistedData(): NotificationItemData {
    let notificationData = {missingData: true} as NotificationItemData;
    let common = null;
    try {
      common = this.rootStore.commonStore.getCommonById(this.eventObjectId);
    } catch (err) {
      logger.warn('NOT EXISTING Common with id: ', this.eventObjectId);
    }

    if (common) {
      const user = this.rootStore.userStore.getUserById(
        common.members[0].userId,
      );
      if (user) {
        notificationData = {
          missingData: false,
          descriptionBold: `"${common.name}"`,
          description: ' - You might want to check it out.',
          ownerAvatar: user.photoURL,
          common,
        };
      }
    }

    return (notificationData as NotificationItemData) || null;
  }

  private getFundingRequestData(): NotificationItemData {
    let notificationData = {missingData: true} as NotificationItemData;
    const proposalNotificationData = this.getProposalNotificationData();

    if (proposalNotificationData) {
      const {user, common} = proposalNotificationData;
      const proposal = new Proposal(proposalNotificationData.proposal);

      notificationData = {
        missingData: false,
        descriptionBold: `"${
          (proposal.description as IFundingRequestDescription).title
        }"`,
        description: ` ($${proposal.fundingFormatted} requested)`,
        common,
        ownerAvatar: user.photoURL,
        proposal,
      };

      if (this.eventType === EventTypeState.fundingRequestCreated) {
        notificationData = {
          ...notificationData,
          header: ' by',
          headerBold: ` "${user.firstName} ${user.lastName}"`,
        };
      }
    }

    return (notificationData as NotificationItemData) || null;
  }

  private getReqToJoinRejectedData(): NotificationItemData {
    let notificationData = {missingData: true} as NotificationItemData;
    const proposalNotificationData = this.getProposalNotificationData();

    if (proposalNotificationData) {
      const {proposal, user, common} = proposalNotificationData;
      notificationData = {
        missingData: false,
        description:
          " Don't give up, there are plenty of other Commons you can join.",
        ownerAvatar: user.photoURL,
        common,
        proposal,
      };
    }
    return (notificationData as NotificationItemData) || null;
  }

  private getReqToJoinCreatedData(): NotificationItemData {
    let notificationData = {missingData: true} as NotificationItemData;
    const proposalNotificationData = this.getProposalNotificationData();

    if (proposalNotificationData) {
      const {proposal, common} = proposalNotificationData;

      notificationData = {
        missingData: false,
        description:
          ' Your Common has new pending members, view their requests and vote',
        ownerAvatar: common.image,
        common,
        proposal,
      };
    }

    return (notificationData as NotificationItemData) || null;
  }

  private getReqToJoinAcceptedData(): NotificationItemData {
    let notificationData = {missingData: true} as NotificationItemData;
    const proposalNotificationData = this.getProposalNotificationData();

    if (proposalNotificationData) {
      const {proposal, user, common} = proposalNotificationData;

      notificationData = {
        missingData: false,
        description: ' Congrats! You are now a member!',
        ownerAvatar: user.photoURL,
        common,
        proposal,
      };
    }

    return (notificationData as NotificationItemData) || null;
  }

  private getMessageCreatedData(): NotificationItemData {
    let notificationData = {missingData: true} as NotificationItemData;
    const message = this.rootStore.discussionMessageStore.getDiscussionMessageById(
      this.eventObjectId,
    );
    if (message) {
      const discussion = this.rootStore.discussionStore.getDiscussionById(
        message.discussionId,
      );
      const user = this.rootStore.userStore.getUserById(message.ownerId);

      if (discussion && user) {
        notificationData = {
          missingData: false,
          descriptionBold: `${user.firstName} ${user.lastName}`,
          description: ` ${message.text}`,
          ownerAvatar: user.photoURL,
          discussion: discussion,
        };
      }

      if (discussion && discussion.commonId) {
        const common = this.rootStore.commonStore.getCommonById(
          discussion.commonId,
        );

        if (common && common.name) {
          notificationData = {
            ...notificationData,
            header: ' on',
            headerBold: ` "${discussion.title}"`,
            common,
          };
        }
      }
    }

    return (notificationData as NotificationItemData) || null;
  }

  private getProposalNotificationData(): IProposalNotificationData | null {
    let user = null;
    let common = null;
    let proposal = this.rootStore.proposalStore.getProposalById(
      this.eventObjectId,
    );
    if (proposal) {
      common = this.rootStore.commonStore.getCommonById(proposal.commonId);
      user = this.rootStore.userStore.getUserById(proposal.proposerId);
    }

    if (proposal && user && common) {
      return {
        proposal,
        common,
        user,
      } as IProposalNotificationData;
    } else {
      return null;
    }
  }

  constructor(newNotificationInfo: INotificationEntity, rootStore: RootStore) {
    super(newNotificationInfo);
    this.rootStore = rootStore;
    this.id = newNotificationInfo.id;
    this.eventObjectId = newNotificationInfo.eventObjectId;
    this.eventType = newNotificationInfo.eventType;
    this.userFilter = newNotificationInfo.userFilter;
  }
}

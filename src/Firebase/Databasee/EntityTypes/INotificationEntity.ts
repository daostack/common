import {Common} from '~/Stores/Models/Common';
import {Discussion} from '~/Stores/Models/Discussion';
import {Proposal} from '~/Stores/Models/Proposal';
import {UserModel} from '~/Stores/Models/UserModel';
import {IBaseEntity} from './IBaseEntity';

export interface INotificationEntity extends IBaseEntity {
  eventObjectId: string;
  eventType: string;

  userFilter: Array<string>;
}

export interface BadgeProps {
  title?: string;
  bgColor?: string;
  textColor?: string;
}

export interface IProposalNotificationData {
  proposal: Proposal;
  common: Common;
  user: UserModel;
}

export interface NotificationItemData {
  missingData: boolean;
  discussion?: Discussion;
  ownerAvatar?: string;
  createdAt?: object;
  description?: string;
  descriptionBold?: string;
  header?: string;
  headerBold?: string;
  commonName?: string;
  common?: Common;
  commonId?: string;
  proposal?: Proposal;
}

export const EventTypeState = {
  creationReqToJoin: 'creationReqToJoin',
  requestToJoinCreated: 'requestToJoinCreated',
  requestToJoinExecuted: 'requestToJoinExecuted',
  requestToJoinRejected: 'requestToJoinRejected',
  requestToJoinAccepted: 'requestToJoinAccepted',
  subscriptionPaymentConfirmed: 'subscriptionPaymentConfirmed',
  subscriptionCanceledByUser: 'subscriptionCanceledByUser',
  fundingRequestAccepted: 'fundingRequestAccepted',
  fundingRequestCreated: 'fundingRequestCreated',
  fundingRequestExecuted: 'fundingRequestExecuted',
  fundingRequestRejected: 'fundingRequestRejected',
  voteCreated: 'voteCreated',
  cardCreated: 'cardCreated',
  paymentFailed: 'paymentFailed',
  messageCreated: 'messageCreated',
  commonCreated: 'commonCreated',
  commonWhitelisted: 'commonWhitelisted',
  commonMemberAdded: 'commonMemberAdded',
};

export const EventTitleState = {
  creationReqToJoin: 'Request To Join Created',
  requestToJoinCreated: 'Membership Request Created',
  requestToJoinExecuted: 'Request To Join Executed',
  requestToJoinAccepted: 'Membership Approved',
  requestToJoinRejected: 'Membership Rejected',
  subscriptionPaymentConfirmed: 'Subscription Payment Confirmed',
  subscriptionCanceledByUser: 'Subscription Canceled By User',
  fundingRequestAccepted: 'Proposal Accepted',
  fundingRequestCreated: 'New Proposal',
  fundingRequestExecuted: 'Proposal Executed',
  fundingRequestRejected: 'Proposal Rejected',
  cardCreated: 'Card Created',
  voteCreated: 'Vote Created',
  paymentFailed: 'Payment Failed',
  messageCreated: 'New Comment',
  commonCreated: 'Common Created',
  commonWhitelisted: 'New Featured Common',
  commonMemberAdded: 'Common Member Added',
};

// NOTE: EventTypesOnNotificationList legth is 10 and it is used in a firebase query with 'in' operator.
// Firebase support up to 10 elements for `in` operator, so keep in mind when adding new event.
export const EventTypesOnNotificationList = [
  EventTypeState.commonWhitelisted,
  EventTypeState.commonCreated,
  EventTypeState.fundingRequestCreated,
  EventTypeState.fundingRequestAccepted,
  EventTypeState.fundingRequestExecuted,
  EventTypeState.fundingRequestRejected,
  EventTypeState.messageCreated,
  EventTypeState.requestToJoinAccepted,
  EventTypeState.requestToJoinCreated,
  EventTypeState.requestToJoinRejected,
];

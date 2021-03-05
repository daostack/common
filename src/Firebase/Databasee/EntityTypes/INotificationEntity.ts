export interface BadgeProps {
  title?: string;
  bgColor?: string;
  textColor?: string;
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

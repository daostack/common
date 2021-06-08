export enum EventType {
	// Common related events
  COMMON_CREATED = 'commonCreated',
  COMMON_CREATION_FAILED = 'commonCreationFailed',
  COMMON_WHITELISTED = 'commonWhitelisted',
  COMMON_MEMBER_ADDED = 'commonMemberAdded',
  COMMON_MEMBER_REMOVED = 'commonMemberRemoved',
  COMMON_UPDATED = 'commonUpdated',


  // Request to join related events
  REQUEST_TO_JOIN_CREATED = 'requestToJoinCreated',
  REQUEST_TO_JOIN_ACCEPTED = 'requestToJoinAccepted',
  REQUEST_TO_JOIN_REJECTED = 'requestToJoinRejected',
  REQUEST_TO_JOIN_EXECUTED = 'requestToJoinExecuted',


  // Funding request related event
  FUNDING_REQUEST_CREATED = 'fundingRequestCreated',
  FUNDING_REQUEST_REJECTED = 'fundingRequestRejected',
  FUNDING_REQUEST_EXECUTED = 'fundingRequestExecuted',
  FUNDING_REQUEST_ACCEPTED = 'fundingRequestAccepted',
  FUNDING_REQUEST_ACCEPTED_INSUFFICIENT_FUNDS = 'fundingRequestAcceptedInsufficientFunds',


  // Voting related events
  VOTE_CREATED = 'voteCreated',


  // Payment related events
  PAYMENT_CREATED = 'paymentCreated',
  PAYMENT_CONFIRMED = 'paymentConfirmed',
  PAYMENT_UPDATED = 'paymentConfirmed',
  PAYMENT_FAILED = 'paymentFailed',
  PAYMENT_PAID = 'paymentPaid',

  // Payout related events
  PAYOUT_CREATED = 'payoutCreated',
  PAYOUT_APPROVED = 'payoutApproved',
  PAYOUT_EXECUTED = 'payoutExecuted',
  PAYOUT_VOIDED = 'payoutVoided',

  PAYOUT_COMPLETED = 'payoutCompleted',
  PAYOUT_FAILED = 'payoutFailed',

  // Card related events
  CARD_CREATED = 'cardCreated',

  // Messaging related events
  DISCUSSION_CREATED = 'discussionCreated',
  MESSAGE_CREATED = 'messageCreated',

  // Subscriptions
  SUBSCRIPTION_CREATED = 'subscriptionCreated',
  SUBSCRIPTION_PAYMENT_CREATED = 'subscriptionPaymentCreated',
  SUBSCRIPTION_PAYMENT_FAILED = 'subscriptionPaymentFailed',
  SUBSCRIPTION_PAYMENT_CONFIRMED = 'subscriptionPaymentConfirmed',
  SUBSCRIPTION_PAYMENT_STUCK = 'subscriptionPaymentStuck',
  SUBSCRIPTION_CANCELED_BY_USER = 'subscriptionCanceledByUser',
  SUBSCRIPTION_CANCELED_BY_PAYMENT_FAILURE = 'subscriptionCanceledByPaymentFailure',

  // Membership
  MEMBERSHIP_REVOKED = 'membershipRevoked',

  //moderation
  DISCUSSION_MESSAGE_REPORTED = 'discussionMessageReported',
  PROPOSAL_REPORTED = 'proposalReported',
  DISCUSSION_REPORTED = 'discussionReported',
}

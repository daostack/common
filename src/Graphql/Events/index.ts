export enum EventType {
	// Common related events
  COMMON_CREATED = 'CommonCreated',
  COMMON_CREATION_FAILED = 'commonCreationFailed',
  COMMON_WHITELISTED = 'CommonWhitelisted',
  COMMON_MEMBER_ADDED = 'CommonMemberCreated',
  COMMON_MEMBER_REMOVED = 'commonMemberRemoved',
  COMMON_UPDATED = 'CommonUpdated',


  // Request to join related events
  REQUEST_TO_JOIN_CREATED = 'JoinRequestCreated',
  REQUEST_TO_JOIN_ACCEPTED = 'JoinRequestAccepted',
  REQUEST_TO_JOIN_REJECTED = 'JoinRequestRejected',
  REQUEST_TO_JOIN_EXECUTED = 'requestToJoinExecuted',


  // Funding request related event
  FUNDING_REQUEST_CREATED = 'FundingRequestCreated',
  FUNDING_REQUEST_REJECTED = 'FundingRequestRejected',
  FUNDING_REQUEST_EXECUTED = 'fundingRequestExecuted',
  FUNDING_REQUEST_ACCEPTED = 'FundingRequestAccepted',
  FUNDING_REQUEST_ACCEPTED_INSUFFICIENT_FUNDS = 'fundingRequestAcceptedInsufficientFunds',


  // Voting related events
  VOTE_CREATED = 'VoteCreated',


  // Payment related events
  PAYMENT_CREATED = 'PaymentCreated',
  PAYMENT_CONFIRMED = 'paymentConfirmed',
  PAYMENT_UPDATED = 'paymentConfirmed',
  PAYMENT_FAILED = 'PaymentFailed',
  PAYMENT_PAID = 'PaymentSucceeded',

  // Payout related events
  PAYOUT_CREATED = 'PayoutCreated',
  PAYOUT_APPROVED = 'PayoutApproved',
  PAYOUT_EXECUTED = 'PayoutExecuted',
  PAYOUT_VOIDED = 'payoutVoided',

  PAYOUT_COMPLETED = 'PayoutCompleted',
  PAYOUT_FAILED = 'PaymentFailed',

  // Card related events
  CARD_CREATED = 'CardCreated',

  // Messaging related events
  DISCUSSION_CREATED = 'DiscussionCreated',
  MESSAGE_CREATED = 'DiscussionMessageCreated',

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

export const PROPOSAL_PAYMENT_STATE = {
  FAILED: 'failed',
  PENDING: 'pending',
  NOT_ATTEMPTED: 'notAttempted',
};

export const ACTIVE_PAYMENT_STATES = [
  PROPOSAL_PAYMENT_STATE.NOT_ATTEMPTED,
  PROPOSAL_PAYMENT_STATE.PENDING,
];

export const MAX_CONTRIBUTION = 5000;

export enum PAYMENT_STATUSES {
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export enum CONTRIBUTION_TYPES {
  ONE_TIME = 'one-time',
  SUBSCRIPTION = 'subscription',
}

export enum SUBSCRIPTION_STATUSES {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  CANCELED_BY_USER = 'CanceledByUser',
  CANCELED_BY_PAYMENT_FAILURE = 'CanceledByPaymentFailure',
  PAYMENT_FAILED = 'PaymentFailed',
}

export enum VoteOutcome {
  APPROVE = 'Approve',
  REJECT = 'Condemn',
}

export type Vote = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  outcome: VoteOutcome;
};

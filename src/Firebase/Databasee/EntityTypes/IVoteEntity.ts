import {IBaseEntity} from './IBaseEntity';

export interface IVoteEntity extends IBaseEntity {
  /**
   * The id of the user who created this vote
   */
  voterId: string;

  commonId: string;

  proposalId: string;

  /**
   * The outcome of this voter of this proposal
   */
  outcome: VoteOutcome;
}

export type VoteOutcome = 'approved' | 'rejected' | 'abstained';

export interface ChangeVotePayload {
  outcome: VoteOutcome;
  proposalId: string;
}

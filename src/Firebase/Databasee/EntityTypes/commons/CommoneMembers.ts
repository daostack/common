import {firebase} from '~/Firebase';
import {AllowedActions, AllowedProposals} from '../governance/Circles';
import {Reputation} from '../governance/Reputation';

export interface CommonMember {
  readonly id: string;
  readonly userId: string;
  joinedAt: firebase.firestore.Timestamp;
  circles: number;
  allowedActions: AllowedActions;
  allowedProposals: AllowedProposals;
  tokenBalance: number;
  reputation: Partial<Reputation>;
}

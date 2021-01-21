import {firebase} from '~/Firebase';

export interface ICommonMember {
  userId: string;
  joinedAt?: firebase.firestore.Timestamp;
}

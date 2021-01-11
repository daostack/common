import {firebase} from '~/Firebase';

export interface IUserEntity {
  uid: string;

  email: string;
  photoURL: string;

  firstName: string;
  lastName: string;
  displayName: string;
  id: string;

  /**
   * The time that the entity
   * was created
   */
  createdAt: firebase.firestore.Timestamp;

  /**
   * The last time that the entity
   * was modified
   */
  updatedAt: firebase.firestore.Timestamp;
}

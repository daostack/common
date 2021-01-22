import {firebase} from '~/Firebase';

export interface IBaseEntity {
  /**
   * The main identifier of the common
   */
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

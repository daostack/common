import {IBaseEntity} from './IBaseEntity';
import {firebase} from '~/Firebase';

// TODO: implement IBaseEntity when the backend is refactored
export interface IDiscussionMessageEntity extends IBaseEntity {
  /**
   * ID of the parent discussion of this message, could be a Discussion ID, or a Proposal ID
   */
  discussionId: string;

  /**
   * The ID of the creator of the message
   */
  ownerId: string;

  /**
   * The name of the creator of the message
   */
  ownerName: string;

  /**
   * The content of the message
   */
  text: string;

  /**
   * Time of creation
   */
  createTime: firebase.firestore.Timestamp;

  /**
   * Image URLs of the user's avatar
   */
  ownerAvatar: string;
}

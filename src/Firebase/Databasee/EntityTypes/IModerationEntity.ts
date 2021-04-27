import {IBaseEntity} from './IBaseEntity';
import {firebase} from '~/Firebase';

export interface IModerationEntity extends IBaseEntity {
  /**
   * type of moderation: hidden, reported, visible
   */
  flag: string;

  /**
   * UserId of the moderator
   */
  moderator: string;

  /**
   * Moderator not about why this object was reported
   */
  note?: string;

  /**
   * Array of reasons why this object was reported
   */
  reasons: string[];

  /**
   * The userId of the person who reported this object
   * every member can report an object
   */
  reporter: string;

  /**
   * The time of the moderation
   */
  updatedAt: firebase.firestore.Timestamp;

  /**
   * For when proposal was hidden and then shown during quiet ending period,
   * we want to restart the countdown from the beginning of he quiet ending period
   */
  countdownStart: firebase.firestore.Timestamp;
}

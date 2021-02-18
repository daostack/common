import {IBaseEntity} from './IBaseEntity';

export interface IUserEntity extends IBaseEntity {
  // TODO: remove "uid" from the users collection and use "id";
  // The users collection is the only one that has & use "uid" instead of "id" for representing the unique id.
  // However in the IBaseEntity there is "id" both in mobile app and clouldfunctions.
  uid: string;

  email: string;
  photoURL: string;

  firstName: string;
  lastName: string;

  roles?: object // TODO roles type
}

import {makeAutoObservable} from 'mobx';
import {firebase} from '~/Firebase';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {filterObjectByKeys} from '~/Util';
import {BaseModel} from './BaseModel';

export const userInfoFields = [
  'uid',
  'firstName',
  'lastName',
  'email',
  'photoURL',
  'updatedAt',
  'createdAt',
  'intro',
  'country',
];
export class UserModel implements BaseModel<IUserEntity> {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  uid: string = '';
  email: string = '';
  photoURL: string = '';
  firstName: string = '';
  lastName: string = '';
  country: string = '';
  intro: string = '';

  // That field is used only in the commonMembers list
  joinedAt?: Date | null = null;

  constructor(newUserInfo: IUserEntity) {
    // Filter the provided newUserInfo values in order to be sure there are no extra data.
    // Currently there are users with displayName prop in the DB,
    // but here the displayName is computed field which can't be assigned a value to.
    const filteredUser: IUserEntity = filterObjectByKeys(
      newUserInfo,
      userInfoFields,
    ) as IUserEntity;

    this.setUser(filteredUser);
    makeAutoObservable(this);
  }

  get displayName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`;
  }

  get displayNameFormatted(): string {
    // The regex below is used to separate names and
    // make them less at most 25 character, but with cutting
    // the name only at whitespaces
    return this.displayName?.match(/.{1,25}(\s|$)/g)[0];
  }

  setUser(newUserInfo: IUserEntity) {
    Object.keys(newUserInfo).forEach((key) => {
      this[key] = newUserInfo[key];
    });
  }
}

import {observable, decorate, action, computed} from 'mobx';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {filterObjectByKeys} from '~/Util';

export const userInfoFields = [
  'uid',
  'firstName',
  'lastName',
  'email',
  'photoURL',
  'updatedAt',
  'createdAt',
];
export class UserModel implements IUserEntity {
  // Fields
  uid: string = '';
  id: string = '';
  email: string = '';
  photoURL: string = '';
  firstName: string = '';
  lastName: string = '';
  createdAt: Date | null = null;
  updatedAt: Date | null = null;

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
  }

  // Computed fields:
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

decorate(UserModel, {
  //observables
  uid: observable,
  email: observable,
  photoURL: observable,
  firstName: observable,
  lastName: observable,
  createdAt: observable,
  updatedAt: observable,

  //computed
  displayName: computed,
  displayNameFormatted: computed,

  //actions
  setUser: action,
});

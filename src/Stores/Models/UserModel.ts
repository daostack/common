import {observable, decorate, action, computed} from 'mobx';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';

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

  constructor(newUserInfo: IUserEntity) {
    this.setUser(newUserInfo);
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
    if (newUserInfo) {
      if (newUserInfo.uid) {
        this.uid = newUserInfo.uid;
      }
      if (newUserInfo.email) {
        this.email = newUserInfo.email;
      }
      if (newUserInfo.firstName) {
        this.firstName = newUserInfo.firstName;
      }
      if (newUserInfo.lastName) {
        this.lastName = newUserInfo.lastName;
      }
      if (newUserInfo.photoURL) {
        this.photoURL = newUserInfo.photoURL;
      }
    }
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

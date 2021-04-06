import {observable, action, computed} from 'mobx';
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
export class UserModel extends BaseModel<IUserEntity> {
  @observable
  uid: string = '';

  @observable
  email: string = '';

  @observable
  photoURL: string = '';

  @observable
  firstName: string = '';

  @observable
  lastName: string = '';

  @observable
  country: string = '';

  intro: string = '';

  // That field is used only in the commonMembers list
  @observable
  joinedAt?: Date | null = null;

  constructor(newUserInfo: IUserEntity) {
    super(newUserInfo);
    // Filter the provided newUserInfo values in order to be sure there are no extra data.
    // Currently there are users with displayName prop in the DB,
    // but here the displayName is computed field which can't be assigned a value to.
    const filteredUser: IUserEntity = filterObjectByKeys(
      newUserInfo,
      userInfoFields,
    ) as IUserEntity;

    this.setUser(filteredUser);
  }

  @computed
  get displayName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`;
  }

  @computed
  get displayNameFormatted(): string {
    // The regex below is used to separate names and
    // make them less at most 25 character, but with cutting
    // the name only at whitespaces
    return this.displayName?.match(/.{1,25}(\s|$)/g)[0];
  }

  @action
  setUser(newUserInfo: IUserEntity) {
    Object.keys(newUserInfo).forEach((key) => {
      this[key] = newUserInfo[key];
    });
  }
}

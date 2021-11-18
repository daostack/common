import {Document} from 'firestorter';
import {IUserEntity} from '~/Types/EntityTypes/IUserEntity';
import {AUTH_PROVIDER_ID, getCurrentUser, Timestamp} from '~/Firebase';

// import UserCommonStore from './user-commons';

export class UserModel extends Document<IUserEntity> implements IUserEntity {
  get uid(): string {
    return this.data.uid;
  }

  get email(): string {
    return this.data.email;
  }

  get photoURL(): string {
    return this.data.photoURL;
  }

  get firstName(): string {
    return this.data.firstName;
  }

  get lastName(): string {
    return this.data.lastName;
  }

  get country(): string {
    return this.data.country;
  }

  get intro(): string {
    return this.data.intro;
  }

  get onboarded(): boolean {
    return this.data.onboarded;
  }
  // That field is used only in the commonMembers list
  get joinedAt(): Timestamp {
    return this.data.joinedAt;
  }

  get createdAt(): Timestamp {
    return this.data.createdAt;
  }

  get updatedAt(): Timestamp {
    return this.data.updatedAt;
  }

  get id() {
    return this.uid;
  }
  get displayName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`;
  }
  get displayNameFormatted(): string {
    // The regex below is used to separate names and
    // make them less at most 25 character, but with cutting
    // the name only at whitespace
    const formatted = this.displayName?.match(/.{1,25}(\s|$)/g);
    return !!formatted && formatted?.length !== 0 ? formatted[0] : 'unknown';
  }

  get isSignedWithApple() {
    return getCurrentUser()!.providerId === AUTH_PROVIDER_ID.APPLE;
  }
  get isCompleteAccount() {
    // TODO: not sure when account is completed
    return true;
  }
  get fullName() {
    return getCurrentUser()?.uid === this.uid
      ? 'you'
      : `${this.firstName || ''} ${this.lastName || ''}`;
  }

  get reporterName() {
    return this.fullName;
  }
}

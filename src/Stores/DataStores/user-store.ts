import {makeAutoObservable} from 'mobx';
import {UserModel} from '../Models';
import {getUserCommons} from '../data-sources';

export class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  getUserCommons = (uid?: string) => getUserCommons(uid);

  // Data consuming methods
  getUserById = (uid: string) => new UserModel(`users/${uid}`);
}

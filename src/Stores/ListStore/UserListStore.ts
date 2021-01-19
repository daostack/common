import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {UserModel} from '../Models/UserModel';
import ListStore from './ListStore';
import {subscribeToAllUsers} from '~/Services/ListServices/UserListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';

export default class UserListStore extends ListStore<UserModel> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  // Data consuming methods
  getUserById = (uid: string): IUserEntity | undefined =>
    super.getDataById(uid);

  getCommonUsersByMembersArray = (members: Array<string>): Array<UserModel> => {
    const dataByIds: Array<UserModel> = [];
    members.forEach((id) => {
      const currData = this.getDataById(id);
      if (currData) {
        currData && dataByIds.push(currData);
      } else {
        this.rootStore.authStore.userInfo?.uid === id &&
          dataByIds.push(this.rootStore.authStore.userInfo);
      }
    });
    return dataByIds;
  };

  //Actions
  subscribeToAllUsers = (): FirestoreUnsubscribeFn =>
    subscribeToAllUsers(this._updateUserList);

  // Private function
  _updateUserList = (updatedUserList: Array<IUserEntity>) => {
    updatedUserList.forEach((userEntity: IUserEntity) => {
      super.setData(userEntity.uid, new UserModel(userEntity));
    });
  };
}

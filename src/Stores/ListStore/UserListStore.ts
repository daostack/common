import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {UserModel} from '../Models/UserModel';
import ListStore from './ListStore';
import {subscribeToAllUsers} from '~/Services/ListServices/UserListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {ICommonMember} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';

export default class UserListStore extends ListStore<UserModel> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  // Data consuming methods
  getUserById = (uid: string): UserModel => super.getDataById(uid);

  getCommonUsersByMembersArray = (
    members: Array<ICommonMember>,
  ): Array<UserModel> =>
    members.map((commonMember: ICommonMember) => {
      const user = this.getUserById(commonMember.userId);
      user.joinedAt = commonMember.joinedAt;
      return user;
    });

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

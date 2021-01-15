import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {UserModel} from '../Models/UserModel';
import ListStore from './ListStore';
import {subscribeToAllUsers} from '~/Services/ListServices/UserListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {ICommonMember} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
export default class UserListStore extends ListStore<UserModel> {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    super();
    this.rootStore = rootStore;
  }

  // Data consuming methods
  getUserById = (uid: string): IUserEntity | undefined =>
    super.getDataById(uid);

  getCommonUsersByMembersArray = (
    members: Array<ICommonMember>,
  ): Array<UserModel> => {
    //commonMembers.map((member) => member.userId);

    const dataByIds: Array<UserModel> = [];
    members.forEach((commonMember: ICommonMember) => {
      const user = this.getDataById(commonMember.userId);
      if (user) {
        user.joinedAt = commonMember.joinedAt;
        dataByIds.push(user);
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

import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {UserModel} from '../Models/UserModel';
import BaseStore from './BaseStore';
import {subscribeToAllUsers} from '~/Services/ListServices/UserListService';
import {FirestoreUnsubscribeFn, IFirebaseDocChange} from '~/Firebase/types';
import RootStore from '../RootStore';
import {ICommonMember} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {showBackendError} from '~/Util';

export default class UserStore extends BaseStore<UserModel, IUserEntity> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  // Data consuming methods
  getUserById = (uid: string): UserModel => {
    try {
      return this.getDataById(uid) as UserModel;
    } catch (error) {
      showBackendError({
        bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
      });
      return {} as UserModel;
    }
  };

  getCommonUsersByMembersArray = (
    members: Array<ICommonMember>,
  ): Array<UserModel> => {
    try {
      return members.map((commonMember: ICommonMember) => {
        const user = this.getUserById(commonMember.userId);
        user.joinedAt = commonMember.joinedAt;
        return user;
      });
    } catch (error) {
      setTimeout(() => {
        showBackendError({
          bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
        });
      }, 0);

      return [];
    }
  };

  //Actions
  subscribeToAllUsers = (): FirestoreUnsubscribeFn =>
    subscribeToAllUsers(this.updateStoreData);

  // Overriden methods
  getEntityModel(entity: IUserEntity): UserModel {
    return new UserModel(entity);
  }

  firestoreDocChangeToEntity(
    firebaseDoc: IFirebaseDocChange<IUserEntity>,
  ): IUserEntity {
    const userDoc = super.firestoreDocChangeToEntity(firebaseDoc);
    // TODO: remove firestoreDocChangeToEntity method overriding when we replace uid with id in user document
    return {
      ...userDoc,
      id: userDoc.uid,
    };
  }
}

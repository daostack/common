import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {UserModel} from '../Models/UserModel';
import BaseStore from './BaseStore';
import {
  subscribeToAllUsers,
  fetchUserById,
} from '~/Services/UserService';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseDocChange,
} from '~/Firebase/types';
import RootStore from '../RootStore';
import {ICommonMember} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {showBackendError} from '~/Util';
import {runInAction} from 'mobx';

export default class UserStore extends BaseStore<UserModel, IUserEntity> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  // Data consuming methods
  getUserById = (uid: string): UserModel | undefined => {
    try {
      return this.getDataById(uid);
    } catch (err) {
      fetchUserById(uid)
        .then((user: IFirebaseDoc<IUserEntity>) => {
          if (user.exists) {
            runInAction(() => {
              this.setData(
                uid,
                this.getEntityModel(this.firestoreDocToEntity(user)),
              );
            });
          }
        })
        .catch(() => {
          showBackendError({
            bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
          });
        });
      return {} as UserModel;
    }
  };

  getCommonUsersByMembersArray = (
    members: Array<ICommonMember>,
  ): Array<UserModel | undefined> => {
    try {
      return members.map((commonMember: ICommonMember) => {
        const user = this.getUserById(commonMember.userId);
        if (user) {
          user.joinedAt = commonMember.joinedAt;
          return user;
        }
      });
    } catch (error) {
      setTimeout(() => {
        showBackendError({
          bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
        });
      });
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

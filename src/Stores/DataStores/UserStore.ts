import {observable, ObservableMap, runInAction} from 'mobx';
import {IFirebaseDoc} from '~/Firebase/types';
import {CommonMemberType} from '~/Graphql/Common/CommonType';
import {UserType} from '~/Graphql/User';
import {
  fetchUserById,
  getUserById,
} from '~/Services/ListServices/UserListService';
import {showBackendError} from '~/Util';
import {UserModel} from '../Models/UserModel';
import RootStore from '../RootStore';
import BaseStore from './BaseStore';

export default class UserStore extends BaseStore<UserModel, UserType> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }
  @observable
  private users: ObservableMap<string, UserModel> = observable.map({});

  // Data consuming methods
  getUserById = (uid: string): UserModel | undefined => {
    try {
      return this.getDataById(uid);
    } catch (err) {
      fetchUserById(uid)
        .then((user: IFirebaseDoc<UserType>) => {
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

  // Data consuming methods
  getGraphqlUserById = async (uid: string): Promise<UserModel | void> => {
    try {
      return this.getDataByIdAndCollections(uid, [this.users]);
    } catch (err) {
      try {
        const user = await getUserById(uid);
        this.users.merge(this.toEntityModelArr([user as UserType]));
        return new UserModel(user as UserType);
      } catch (error) {
        showBackendError({
          bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
        });
      }
    }
  };

  getCommonUsersByMembersArray = (
    members: Array<CommonMemberType>,
  ): Array<UserModel | undefined> => {
    try {
      return members.map((commonMember: CommonMemberType) => {
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

  // Overriden methods
  getEntityModel(entity: UserType): UserModel {
    return new UserModel(entity);
  }
}

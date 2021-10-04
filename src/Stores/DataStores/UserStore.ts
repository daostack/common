import {observable, ObservableMap, runInAction} from 'mobx';
import {CommonMemberType} from '~/Graphql/Common/CommonType';
import {UserType} from '~/Graphql/User';
import {
  fetchUserById,
  getUserById,
} from '~/Services/ListServices/UserListService';
import {getUserById} from '~/Services/ListServices/UserListService';
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
  getUserById = async (uid: string): Promise<UserModel | void> => {
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

  // Overriden methods
  getEntityModel(entity: UserType): UserModel {
    return new UserModel(entity);
  }
}

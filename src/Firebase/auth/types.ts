export type UserProviderRecord = any;

export interface AuthProviderActions {
  getCurrentLoggedUser(): Promise<UserProviderRecord>;
  signOut(): Promise<any>;
}

import {BaseType} from '~/Graphql/BaseType';

export interface IUserEntity extends BaseType {
  uid: string;

  email: string;
  photoURL: string;

  firstName: string;
  lastName: string;
  country: string;
  displayName?: string;
}

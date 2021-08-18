import {BaseType} from '~/Graphql/BaseType';

export type UserType = BaseType & {
  uid: string;

  email: string;
  photoURL: string;

  firstName: string;
  lastName: string;
  country: string;
  displayName: string;
};

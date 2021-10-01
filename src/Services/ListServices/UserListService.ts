import {apollo} from '~/Util/helpers/apolloHelper';
import {GetUserInfoDocument} from '~/Graphql';
import {UserModel} from '~/Stores/Models/UserModel';

export const getUserById = async (userId: string): Promise<UserModel> => {
  const {data} = await apollo.query({
    query: GetUserInfoDocument,
    variables: {
      where: {
        userId,
      },
    },
  });

  return new UserModel(data.user);
};

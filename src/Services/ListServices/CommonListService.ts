import {CommonsCollection} from '~/Firebase/Databasee/Collections/CommonsCollection';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {IFirebaseSnapshot} from '~/Firebase/types';
import {
  CommonsWhereInput,
  GetCommonByIdDocument,
  GetCommonsDocument,
  GetUserCommonsDocument,
  GetUserPendingCommonsDocument,
  UpdateCommonInfoDocument,
  UpdateCommonInfoInput,
} from '~/Graphql';
import {apollo} from '~/Util/helpers/apolloHelper';
import {Common} from '../../Stores/Models/Common';

export type commonListLoadCallbackFn = (
  updatedCommonList: IFirebaseSnapshot<ICommonEntity>,
) => void;
export type commonLoadCallbackFn = (
  updatedCommonList: ICommonEntity | null,
) => void;

export const subscribeToAllCommons = (callback: commonListLoadCallbackFn) =>
  CommonsCollection.onSnapshot((snapshot: any) => {
    callback(snapshot);
  });

export const fetchCommonById = async (commonId: string): Promise<Common> => {
  if (!commonId) {
    throw new Error(
      'Common Id (commonId) is required parameter, but it was not provided',
    );
  }

  const {data} = await apollo.query({
    query: GetCommonByIdDocument,
    variables: {
      where: {
        id: commonId,
      },
    },
  });
  return new Common(data.common);
};

export const fetchUserPendingCommons = async (): Promise<Common[]> => {
  const {data} = await apollo.query({
    query: GetUserPendingCommonsDocument,
  });

  return data.user?.proposals?.map(({common}: any) => new Common(common)) ?? [];
};
export const fetchUserCommons = async (): Promise<Common[]> => {
  const {data} = await apollo.query({
    query: GetUserCommonsDocument,
  });

  return data.user?.commons.map((item: any) => new Common(item)) ?? [];
};

export const fetchCommons = async ({
  ids = [],
  page = 0,
}: CommonsWhereInput): Promise<Common[]> => {
  const {data} = await apollo.query({
    query: GetCommonsDocument,
    variables: {
      where: ids,
      paginate: {
        skip: page * 10,
        take: 10,
      },
    },
  });

  return data?.commons.map((item: any) => new Common(item)) ?? [];
};

export const updateCommon = async (
  common: UpdateCommonInfoInput,
): Promise<Common> => {
  const {data} = await apollo.mutate({
    mutation: UpdateCommonInfoDocument,
    variables: {common},
  });

  return data.common as Common;
};

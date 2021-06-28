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
  CreateCommonDocument,
  UpdateCommonInfoInput,
  CreateCommonInput,
} from '~/Graphql/Common';
import {apollo} from '~/Util/helpers/apolloHelper';
import {Common} from '../../Stores/Models/Common';
import logger from '~/Services/Logger';
import {getGQLErrorObject} from '~/Util';

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

export const fetchCommonById = async (
  commonId: string,
): Promise<ICommonEntity> => {
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

export const fetchUserPendingCommons = async (): Promise<ICommonEntity[]> => {
  try {
    const {data} = await apollo.query({
      query: GetUserPendingCommonsDocument,
    });

    return (
      data.user?.proposals?.map(
        ({common}: {common: ICommonEntity}) => new Common(common),
      ) ?? []
    );
  } catch (err) {
    logger.log(
      'Error while trying to get pending commons: ',
      getGQLErrorObject(err),
    );
    return [];
  }
};

export const fetchUserCommons = async (): Promise<ICommonEntity[]> => {
  try {
    const {data} = await apollo.query({
      query: GetUserCommonsDocument,
    });

    return (
      data.user?.commons.map((item: ICommonEntity) => new Common(item)) ?? []
    );
  } catch (err) {
    logger.log(
      'Error while trying to get user commons: ',
      getGQLErrorObject(err),
    );
    return [];
  }
};

export const fetchCommons = async ({
  ids = [],
  page = 0,
}: CommonsWhereInput): Promise<Common[]> => {
  try {
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

    return data?.commons.map((item: ICommonEntity) => new Common(item)) ?? [];
  } catch (err) {
    logger.log(
      'Error while trying to get featured commons: ',
      getGQLErrorObject(err),
    );
    return [];
  }
};

export const updateCommon = async (
  common: UpdateCommonInfoInput,
): Promise<Common> => {
  try {
    const {data} = await apollo.mutate({
      mutation: UpdateCommonInfoDocument,
      variables: {common},
    });

    return data.common as Common;
  } catch (err) {
    logger.log('Error while trying to update common: ', getGQLErrorObject(err));
    throw err;
  }
};

export const createCommon = async (
  common: CreateCommonInput,
): Promise<Common> => {
  try {
    const {data} = await apollo.mutate({
      mutation: CreateCommonDocument,
      variables: {common},
    });

    return data.createCommon as Common;
  } catch (err) {
    logger.log('Error while trying to create common: ', getGQLErrorObject(err));
    throw err;
  }
};

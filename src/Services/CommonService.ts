import {axiosCommonClient} from '~/Config/network';
import {auth} from '~/Firebase';
import {CommonsCollection} from '~/Firebase/Databasee/Collections/CommonsCollection';
import {
  ICommonEntity,
  CommonCreatedBody,
} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {IFirebaseDoc, IFirebaseSnapshot} from '~/Firebase/types';

export type commonListLoadCallbackFn = (
  updatedCommonList: IFirebaseSnapshot<ICommonEntity>,
) => void;
export type commonLoadCallbackFn = (
  updatedCommonList: ICommonEntity | null,
) => void;

const endpoints = {
  create: '/create',
  update: '/update',
};

export const subscribeToAllCommons = (callback: commonListLoadCallbackFn) =>
  CommonsCollection.onSnapshot((snapshot: any) => {
    callback(snapshot);
  });

export const createCommon = async (
  formData: CommonCreatedBody,
): Promise<ICommonEntity> => {
  try {
    return await axiosCommonClient.post(endpoints.create, formData, {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    });
  } catch (err) {
    throw err;
  }
};

export const updateCommon = async (
  updateCommonInfo: Partial<ICommonEntity>,
): Promise<void> =>
  await axiosCommonClient.post(
    endpoints.update,
    {
      commonId: updateCommonInfo.id,
      changes: updateCommonInfo,
    },
    {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    },
  );

export const fetchCommonById = async (
  commonId: string,
): Promise<IFirebaseDoc<ICommonEntity>> => {
  if (!commonId) {
    throw new Error(
      'Common Id (commonId) is required parameter, but it was not provided',
    );
  }
  return await CommonsCollection.doc(commonId).get();
};

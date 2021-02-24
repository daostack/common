import {CommonsCollection} from '~/Firebase/Databasee/Collections/CommonsCollection';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';

import {axiosCommonClient} from '../util/AxiosClient';
import {auth} from '~/Firebase';
import {IFirebaseSnapshot} from '~/Firebase/types';

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

export const updateCommon = async (updateCommonInfo: Partial<ICommonEntity>) =>
  await axiosCommonClient.getCommonClient().post(
    axiosCommonClient.getCommonEndpoints().update,
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

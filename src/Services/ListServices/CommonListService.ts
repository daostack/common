import {CommonsCollection} from '~/Firebase/Databasee/Collections/CommonsCollection';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';

export type commonListLoadCallbackFn = (
  updatedCommonList: Array<ICommonEntity>,
) => void;
export type commonLoadCallbackFn = (
  updatedCommonList: ICommonEntity | null,
) => void;

export const subscribeToAllCommons = (callback: commonListLoadCallbackFn) =>
  CommonsCollection.onSnapshot((snapshot: any) => {
    let commonList = [];

    // TODO: Make better handling of changes with docChanges()
    if (!snapshot?.empty || !snapshot) {
      commonList = snapshot.docs.map((doc: any) => doc.data() as ICommonEntity);
    }

    callback(commonList);
  });

// export const subscribeToCommon = (
//   uid: string,
//   callback: commonLoadCallbackFn,
// ) =>
//   CommonsCollection.doc(uid).onSnapshot((snapshot: any) => {
//     let common: ICommonEntity | null = null;

//     // TODO: Make better handling of changes with docChanges()
//     if (!snapshot?.empty || !snapshot) {
//       common = snapshot.data() as ICommonEntity;
//     }

//     callback(common);
//   });

// export const getCommonById = async (
//   commonId: string,
// ): Promise<ICommonEntity> => {
//   if (!commonId) {
//     throw new Error(
//       'Method getCommonById has a required param commonId, but it was not provided',
//     );
//   }
//   const common = await CommonsCollection.doc(commonId).get();
//   return common.data() as ICommonEntity;
// };

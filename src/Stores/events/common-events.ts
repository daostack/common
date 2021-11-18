import {Collection} from 'firestorter';
import {serverTimestamp} from '~/Firebase';
import {CommonCreatedBody} from '~/Types';
import {Common} from '../Models';

export const createCommon = (data: CommonCreatedBody) =>
  new Collection<Common>('daos').add({
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

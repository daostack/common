import {axiosPermissionClient} from '~/Config/network';
import {auth} from '~/Firebase';
import {Role} from '~/Firebase/Databasee/EntityTypes/IPermission';

const endpoints = {
  add: 'add-permission',
};

export const addPermission = async (
  commonId: string,
  userId: string,
  role: Role,
): Promise<void> =>
  await axiosPermissionClient.post(
    endpoints.add,
    {commonId, userId, role},
    {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    },
  );

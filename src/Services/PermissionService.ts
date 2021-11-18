import axios, {AxiosInstance} from 'axios';
import {auth} from '~/Firebase';
import {Role} from '~/Types/EntityTypes/IPermission';
import {permissionsUrl} from '~/Config';

class PermissionService {
  private axiosClient: AxiosInstance;
  private endpoints: {add: string};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: permissionsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      add: 'add-permission',
    };
  }

  addPermission = async (
    commonId: string,
    userId: string,
    role: Role,
  ): Promise<void> =>
    await this.axiosClient.post(
      this.endpoints.add,
      {commonId, userId, role},
      {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      },
    );
}

export default new PermissionService();

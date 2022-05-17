import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {governanceUrl} from '~/Config';
import {auth} from '~/Firebase';
//import {IFirebaseDoc, IFirebaseSnapshot} from '~/Firebase/types';
//import {IGovernance} from '~/Firebase/Databasee/EntityTypes/IGovernance';

class GovernanceService {
  private axiosClient: AxiosInstance;
  private endpoints: {
    create: string;
  };

  constructor() {
    this.axiosClient = axios.create({
      baseURL: governanceUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      create: '/create',
    };
  }

  createGovernance = async (): Promise<void> => {
    try {
      return await this.axiosClient.post(this.endpoints.create, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (error) {
      throw error;
    }
  };
}

export default new GovernanceService();

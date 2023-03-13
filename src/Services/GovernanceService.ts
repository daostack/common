import axios, {AxiosInstance} from 'axios';
import {governanceUrl} from '~/Config';
import {auth} from '~/Firebase';
import {CreateGovernancePayload} from '~/Firebase/Databasee/EntityTypes/governance/Governance';

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

  createGovernance = async (
    payload: CreateGovernancePayload,
  ): Promise<void> => {
    try {
      return await this.axiosClient.post(this.endpoints.create, payload, {
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

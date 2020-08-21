import axios from 'axios';
import { graphqlUrl } from '../Config';

export default class GraphqlSyncService {
    static serviceInstance = null;

    axiosClient = null;

    constructor() {
      this.axiosClient = axios.create({
        baseURL: graphqlUrl(),
        // for dev
        // baseURL: 'http://localhost:5000/common-daostack/us-central1/graphql/',
        timeout: 1000000, // milliseconds
      });
    }

    static getInstance = () => {
      if (GraphqlSyncService.serviceInstance == null) {
        GraphqlSyncService.serviceInstance = new GraphqlSyncService();
      }
      return this.serviceInstance;
    };

    async syncProposalById(proposalId, blockNumber) {
      console.log(`update proposal ${proposalId}`);
      const options = { params: { proposalId, retries: 4, blockNumber } };
      await this.axiosClient.get('update-proposal-by-id', options);
      console.log('Proposal updated: '); // , proposalUpdateResponse);
    }
}

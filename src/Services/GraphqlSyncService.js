import { graphqlUrl } from '../Config';
import axios from 'axios';


export default class GraphqlSyncService {
    static serviceInstance = null;

    axiosClient = null;

    constructor() {
      this.axiosClient = axios.create({
        baseURL: graphqlUrl,
        timeout: 1000000, // milliseconds
      });
    }

    static getInstance = () => {
      if (GraphqlSyncService.serviceInstance == null) {
        GraphqlSyncService.serviceInstance = new GraphqlSyncService();
      }
      return this.serviceInstance;
    };

    async syncProposalById(proposalId) {
      console.log(`update propsal ${proposalId}`);
      const options = { params: { proposalId } };
      const proposalUpdateResponse = await this.axiosClient.get('update-proposal-by-id', options);
      console.log('Proposal updated: ', proposalUpdateResponse);
    }

}

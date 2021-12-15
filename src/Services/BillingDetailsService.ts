import axios, {AxiosInstance} from 'axios';

import {billingDetailsUrl} from '~/Config';
import {auth} from '~/Firebase';

class BillingDetailsService {
  private axiosClient: AxiosInstance;
  private endpoints: {create: string/*; update: string*/};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: billingDetailsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      create: 'billingDetails/create-billing-details',
      //update: '/update',
    };
  }

  async create(billingDetails: object): Promise<void> {
    console.log('billingDetails', billingDetails)
    try {
      return await this.axiosClient.post(
        this.endpoints.create,
        billingDetails,
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        },
      );
    } catch (error) {
      console.log('error', error);
      //throw error;
    }
  }
}

export default new BillingDetailsService();

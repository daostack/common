import axios, {AxiosInstance} from 'axios';

import {payMeUrl} from '~/Config';
import {auth} from '~/Firebase';

class BillingDetailsService {
  private axiosClient: AxiosInstance;
  private endpoints: {add: string; get: string};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: payMeUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      add: '/billing-details/add',
      get: '/billing-details/get',
      //update: '/update',
    };
  }

  async addBillingDetails(billingDetails: object): Promise<void> {
    try {
      return await this.axiosClient.post(this.endpoints.add, billingDetails, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getBillingDetails(): Promise<void> {
    try {
      return await this.axiosClient.get(this.endpoints.get, {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new BillingDetailsService();

import axios, {AxiosInstance} from 'axios';

import {billingDetailsUrl} from '~/Config';
import {auth} from '~/Firebase';

class BillingDetailsService {
  private axiosClient: AxiosInstance;
  private endpoints: {add: string; createToken: string};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: billingDetailsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      add: '/billing-details/add',
      createToken: '/payme/payin/create-buyer-token-page',
      //update: '/update',
    };
  }

  async add(billingDetails: object): Promise<void> {
    console.log('billingDetails', this.endpoints.add)
    try {
      return await this.axiosClient.post(
        this.endpoints.add,
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

  async createBuyerTokenPage(userId: string): Promise<void> {
    console.log('got here');
    try {
      return await this.axiosClient.post(
        this.endpoints.createToken,
        {
          cardId: userId,
        },
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

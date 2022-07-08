import axios, {AxiosInstance} from 'axios';
import {notificationsUrl} from '~/Config';
import {auth} from '~/Firebase';
import {IBankAccountEntity} from '~/Firebase/Databasee/EntityTypes/IBankAccountEntity';

class OnBoardingService {
  private axiosClient: AxiosInstance;
  private endpoints: {
    sendEmail: string;
  };

  constructor() {
    this.axiosClient = axios.create({
      baseURL: notificationsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      sendEmail: '/send-email',
    };
  }

  sendEmail = async (formDetails): Promise<IBankAccountEntity | null> => {
    try {
      const {data} = await this.axiosClient.post(
        this.endpoints.sendEmail,
        formDetails,
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        },
      );
      return data;
    } catch (e) {
      return null;
    }
  };
}

export default new OnBoardingService();

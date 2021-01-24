import axios from 'axios';
import {permissionsUrl} from '~/Config';
import {auth} from '~/Firebase';

const axiosClient = axios.create({
  baseURL: permissionsUrl(),
  timeout: 1000000,
});

const endpoints = {
  add: 'add-permission',
};

export const addPermission = async (common, userId, role) =>
  await axiosClient.post(
    endpoints.add,
    {common, userId, role},
    {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    },
  );

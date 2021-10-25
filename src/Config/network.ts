import axios from 'axios';
import {
  circlePayUrl,
  commonsUrl,
  discussionsUrl,
  permissionsUrl,
} from '~/Config';

export const axiosCircleClient = axios.create({
  baseURL: circlePayUrl(),
  timeout: 1000000,
});

export const axiosCommonClient = axios.create({
  baseURL: commonsUrl(),
  timeout: 1000000,
});

export const axiosDiscussionClient = axios.create({
  baseURL: discussionsUrl(),
  timeout: 1000000,
});

export const axiosPermissionClient = axios.create({
  baseURL: permissionsUrl(),
  timeout: 1000000,
});

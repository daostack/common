import axios from 'axios';
import {
  circlePayUrl,
  commonsUrl,
  discussionsUrl,
  permissionsUrl,
  moderationUrl,
  proposalsUrl,
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

export const axiosModerationClient = axios.create({
  baseURL: moderationUrl(),
  timeout: 1000000,
});

export const axiosProposalClient = axios.create({
  baseURL: proposalsUrl(),
  timeout: 1000000,
});

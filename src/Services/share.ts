import {Common} from '~/Stores/Models';
import Share from 'react-native-share';

export const shareCommon = (common: Common) => {
  const options = {
    url: `https://app.common.io/common/${common.id}`,
    title: "Let's make it happen",
    message: `${common.name} common`,
  };
  Share.open(options);
};

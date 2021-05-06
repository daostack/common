import React from 'react';
import {InferProps, object} from 'prop-types';
import {observer} from 'mobx-react';
import NotificationItem from './NotificationItem';
import {notificationItemPropTypes} from './propType';

const props = {
  item: notificationItemPropTypes.isRequired,
  navigation: object.isRequired,
};

const WelcomeNotification: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
}) => {
  const notificationData = {
    missingData: false,
    descriptionBold: "We're excited to have you with us",
    description: ' Looking for the first Common to join? Browse now.',
    ownerAvatar:
      'https://firebasestorage.googleapis.com/v0/b/common-staging-50741.appspot.com/o/public_img%2FappLogo.png?alt=media&token=41fec685-b6fb-4b56-813a-fd3e8756787a',
  };

  return (
    <NotificationItem
      item={item}
      notificationData={notificationData}
      navigation={navigation}
    />
  );
};

WelcomeNotification.propTypes = props;

export default observer(WelcomeNotification);

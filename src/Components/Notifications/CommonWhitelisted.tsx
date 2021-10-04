import {inject, observer} from 'mobx-react';
import React, {ReactElement, useEffect, useState} from 'react';
import {NotificationItemData} from '~/Graphql/Notification/NotificationType';
import Logger from '~/Services/Logger';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import NotificationItem from './NotificationItem';
import {NotificationProps} from './props';

const CommonWhitelisted = ({
  item,
  rootStore,
}: NotificationProps): ReactElement | null => {
  const [notificationData, setNotificationData] =
    useState<NotificationItemData>({missingData: true});

  useEffect(() => {
    (async () => {
      try {
        if (item.eventObjectId) {
          const common = await rootStore.commonStore.getCommonById(
            item.eventObjectId,
          );

          if (common) {
            const data = {
              missingData: false,
              descriptionBold: `"${common.name}"`,
              description: ' - You might want to check it out.',
              ownerAvatar: common?.image,
              createdAt: item.createdAt,
              common,
            };
            setNotificationData(data);
          }
        }
      } catch (error) {
        Logger.warn('Not found data');
      }
    })();
  }, [item.eventObjectId]);
  // NOTE: if the commonData is still not loaded into the store, we will have an exception here

  //Skip in case of missiing data
  if (notificationData.missingData) {
    return null;
  }

  return <NotificationItem item={item} notificationData={notificationData} />;
};

export default inject('rootStore')(
  observer((props: Omit<NotificationProps, STORE_KEYS>) => (
    <CommonWhitelisted {...(props as NotificationProps)} />
  )),
);

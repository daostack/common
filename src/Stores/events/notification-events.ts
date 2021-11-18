// this should happen on the server!!

import {Collection} from 'firestorter';
import {EventType} from '~/Firebase';
import {Notification, UserModel} from '../Models';

export const addWelcomeNotification = async (user: UserModel) =>
  new Collection<Notification>('notifications').add({
    id: EventType.welcomeNotification,
    descriptionBold: "We're excited to have you with us",
    description: ' Looking for the first Common to join? Browse now.',
    ownerAvatar:
      'https://firebasestorage.googleapis.com/v0/b/common-staging-50741.appspot.com/o/public_img%2FappLogo.png?alt=media&token=41fec685-b6fb-4b56-813a-fd3e8756787a',
    createdAt: user.createdAt,
    eventType: EventType.welcomeNotification,
  });

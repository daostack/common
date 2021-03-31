import {string, object, shape, number, bool} from 'prop-types';

export const notificationDataPropTypes = shape({
  missingData: bool.isRequired,
  common: shape({
    name: string,
  }),
  proposal: shape({
    id: string,
  }),
  discussion: shape({
    id: string,
  }),
  ownerAvatar: string.isRequired,
  description: string,
  descriptionBold: string,
  header: string,
  headerBold: string,
  tabIndex: number,
});

export const notificationItemPropTypes = shape({
  id: string.isRequired,
  eventType: string.isRequired,
  createdAt: object.isRequired,
  eventObjectId: string.isRequired,
  notificationItemState: shape({
    seen: bool.isRequired,
    opened: bool.isRequired,
  }).isRequired,
});

import {ACTIONS, ENTITY_TYPES} from '~/Components/Moderation/constants';
import {axiosModerationClient} from '~/Config/network';
import {auth} from '~/Firebase';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import Toast from '~/Util/Toast.js';

const endpoints = {
  hide: '/hide',
  report: '/report',
  show: '/show',
};

export const hide = async (
  itemId: string,
  type: keyof typeof ENTITY_TYPES,
  commonId: string,
): Promise<IDiscussionEntity | IDiscussionMessageEntity | IProposalEntity> => {
  try {
    return await axiosModerationClient.post(
      endpoints.hide,
      {
        itemId,
        commonId,
        type,
      },
      {
        headers: {
          Authorization: await auth().currentUser.getIdToken(true),
        },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const report = async (
  type: keyof typeof ENTITY_TYPES,
  commonId: string,
  moderationData: Record<string, string>,
): Promise<void> =>
  await axiosModerationClient.post(
    endpoints.report,
    {
      moderationData,
      commonId,
      type,
    },
    {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    },
  );

export const show = async (
  itemId: string,
  commonId: string,
  type: keyof typeof ENTITY_TYPES,
): Promise<void> =>
  await axiosModerationClient.post(
    endpoints.show,
    {
      itemId,
      commonId,
      type,
    },
    {
      headers: {
        Authorization: await auth().currentUser.getIdToken(true),
      },
    },
  );

export const onModerate = async (
  actionType: keyof typeof ACTIONS,
  itemId: string,
  commonId: string,
  itemType: keyof typeof ENTITY_TYPES,
): Promise<boolean | string> => {
  try {
    switch (actionType) {
      case ACTIONS.show:
        Toast.loading('Loading...');
        await show(itemId, commonId, itemType);
        Toast.hide();
        Toast.success('Done');
        return true;
      case ACTIONS.hide:
        Toast.loading('Hiding content...');
        await hide(itemId, itemType, commonId);
        Toast.hide();
        Toast.success('Done');
        return true;
      default:
        // reporting
        return ACTIONS.report;
    }
  } catch (error) {
    Toast.hide();
    Toast.error(`Could not ${actionType.toLowerCase()} content`);
    return false;
  }
};

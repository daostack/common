import {Collection} from 'firestorter';
import {
  DiscussionCreatedBody,
  getCurrentUser,
  serverTimestamp,
} from '~/Firebase';
import {Discussion, DiscussionMessage} from '../Models';

export const createDiscussion = (data: DiscussionCreatedBody) =>
  new Collection<Discussion>('discussions').add({
    ...data,
    createTime: serverTimestamp(),
    lastMessage: serverTimestamp(),
    ownerId: getCurrentUser()!.uid,
  });

export const updateDiscussionLastMessage = async (discussion: Discussion) => {};

export const sendMessageToDiscussion = async (
  message: string,
  discussion: Discussion,
) =>
  getCurrentUser()?.uid &&
  message &&
  message.trim().length > 0 &&
  new Collection<DiscussionMessage>().add({
    text: message,
    createTime: serverTimestamp(),
    ownerId: getCurrentUser()?.uid,
    commonId: discussion.commonId,
    discussionId: discussion.id,
  });

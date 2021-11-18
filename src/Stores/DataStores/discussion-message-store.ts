import {
  getDiscussionMessageById,
  getDiscussionMessagesByDiscussionId,
} from '../data-sources';
import {Discussion} from '../Models';

export class DiscussionMessageStore {
  constructor() {}

  getDiscussionMessageById = (id: string) => getDiscussionMessageById(id);

  getDiscussionMessages = (discussion: Discussion) =>
    getDiscussionMessagesByDiscussionId(discussion.id);
}

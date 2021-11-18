import {DB_COLLECTIONS} from '../index';
import {db} from '../../index';

export const DiscussionMessagesCollection = db.collection(
  DB_COLLECTIONS.discussionMessages,
);

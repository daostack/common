import {flow, when} from 'mobx';
import {DiscussionMessage} from '.';
import {sendMessageToDiscussion} from '../events';
import {Discussion} from './Discussion';

export class NewDiscussionMessage {
  private discussion: Discussion;
  sending = false;
  inputText: string | null = null;
  message: DiscussionMessage | null = null;

  // this should be done by firebase functions:
  updateDiscussionLastMessage = when(
    () => this.sent === true,
    () => {},
  );

  constructor(discussion: Discussion) {
    this.discussion = discussion;
  }

  get isEmptyMessage() {
    return !(this.inputText && this.inputText.trim().length);
  }
  get messageText() {
    return !this.isEmptyMessage ? (this.inputText as string) : null;
  }

  get sent() {
    return !!this.message;
  }

  send = flow(function* (this: NewDiscussionMessage) {
    if (!this.sending && this.messageText) {
      this.sending = true;
      this.message = yield sendMessageToDiscussion(
        this.messageText,
        this.discussion,
      );
      this.sending = false;
    }
  });
}

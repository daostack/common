import {FormStore} from './FormStore';

export enum ModerationFormFields {
  REASONS = 'reasons',
  MODERATOR_NOTE = 'moderatorNote',
  ITEM_ID = 'itemId',
}

export class ModerationFormStore extends FormStore {
  constructor() {
    super();
  }
}

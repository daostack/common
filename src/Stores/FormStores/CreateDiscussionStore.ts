import {flow, makeObservable, observable} from 'mobx';
import {Discussion} from '~/Stores/Models';
import {createDiscussion} from '../events';
import {FormStore} from './FormStore';

const TITLE = 'title';
const MESSAGE = 'message';
const IMAGES = 'images';
const FILES = 'files';

export class CreateDiscussionStore extends FormStore {
  saving: boolean = false;
  discussion: Discussion | null = null;
  constructor() {
    super();
    makeObservable(this, {
      formSave: flow,
      saving: observable,
    });
  }

  formSave = flow(function* (this: CreateDiscussionStore, commonId: string) {
    try {
      if (this.isFormValid()) {
        const changedFields = this.getChangedFormFieldsJson();
        this.saving = true;
        const images = changedFields[IMAGES] || [];
        const files = changedFields[FILES] || [];
        this.discussion = yield createDiscussion({
          title: changedFields[TITLE],
          message: changedFields[MESSAGE],
          commonId: commonId,
          files: files.filter((file: {value: string}) => file.value !== ''),
          images: images.filter((image: {value: string}) => image.value !== ''),
        });
      }
    } catch (err) {
      this.setError(err as string);
    } finally {
      this.saving = false;
    }
  });
}

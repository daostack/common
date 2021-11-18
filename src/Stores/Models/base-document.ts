import {Document} from 'firestorter';
import {IBaseEntity} from '~/Types/EntityTypes/IBaseEntity';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export class BaseDocument<T extends IBaseEntity> extends Document<T> {
  get id() {
    return this.data.id;
  }
  get _createdAt() {
    return (this.data.createdAt as unknown) as FirebaseFirestoreTypes.Timestamp;
  }
  get createdAt() {
    return this._createdAt.toDate();
  }
  get _updatedAt() {
    return (this.data.updatedAt as unknown) as FirebaseFirestoreTypes.Timestamp;
  }
  get updatedAt() {
    return this._updatedAt.toDate();
  }
}

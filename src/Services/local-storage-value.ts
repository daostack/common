import AsyncStorage from '@react-native-community/async-storage';
import {ILazyObservable, lazyObservable} from 'mobx-utils';

interface StorageProperty<T> {
  get(): PromiseLike<T>;
  set(value: T): PromiseLike<void>;
}

interface AsyncStorageTransformer<T> {
  decode(payload: string | null): T;
  encode(value: T): string;
}

type LocalStorageDescriptor<T> = AsyncStorageTransformer<T> & {key: string};

function createStorageProperty<T>({
  key,
  decode,
  encode,
}: AsyncStorageTransformer<T> & {
  key: string;
}): StorageProperty<T> {
  return {
    get: () => AsyncStorage.getItem(key).then((payload) => decode(payload)),
    set: (value: T) => AsyncStorage.setItem(key, encode(value)),
  };
}

export class LocalStorageValue<T> {
  private _value: ILazyObservable<T | undefined>;
  set: (value: T) => PromiseLike<void>;
  get value() {
    return this._value;
  }
  constructor(descriptor: LocalStorageDescriptor<T>) {
    const storageProperty = createStorageProperty(descriptor);
    this._value = lazyObservable((sink) => storageProperty.get().then(sink));
    this.set = (value: T) => storageProperty.set(value);
  }
}

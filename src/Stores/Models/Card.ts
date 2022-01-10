import {makeAutoObservable} from 'mobx';
import {ICardEntity} from '~/Firebase/Databasee/EntityTypes/ICardEntity';
import {firebase} from '~/Firebase';

export class Card implements ICardEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  token: string;
  provider: string;
  ownerId: string;

  constructor(newCardInfo: ICardEntity) {
    this.id = newCardInfo.id;
    this.token = newCardInfo.token;
    this.provider = newCardInfo.provider;
    this.ownerId = newCardInfo.ownerId;
    makeAutoObservable(this);
  }
}

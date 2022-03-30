import {makeAutoObservable} from 'mobx';
import {
  ICardEntity,
  ICardMetadata,
} from '~/Firebase/Databasee/EntityTypes/ICardEntity';
import {firebase} from '~/Firebase';

export class Card implements ICardEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  token: string;
  provider: string;
  ownerId: string;
  metadata?: ICardMetadata;
  fullName: string;

  constructor(newCardInfo: ICardEntity) {
    // newCardInfo {"createdAt": {"nanoseconds": 448000000, "seconds": 1646311557}, "id": "13261a03-dae9-4383-8ff0-78540b08ec00", "metadata": {"digits": "4242", "network": "VISA"}, "ownerId": "WMzKDGJSlWM2Rjx9JVp9StB2Bni2", "provider": "PAYME", "token": "BUYER164-0805211P-T9DEBGO5-20FBFN1V", "updatedAt": {"nanoseconds": 448000000, "seconds": 1646311557}
    this.id = newCardInfo.id;
    this.token = newCardInfo.token;
    this.provider = newCardInfo.provider;
    this.ownerId = newCardInfo.ownerId;
    this.metadata = newCardInfo.metadata;
    this.createdAt = newCardInfo.createdAt;
    this.fullName = newCardInfo.fullName;
    makeAutoObservable(this);
  }
}

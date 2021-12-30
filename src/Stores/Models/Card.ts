import {observable} from 'mobx';
import {ICardEntity} from '~/Firebase/Databasee/EntityTypes/ICardEntity';
import {BaseModel} from './BaseModel';

export class Card extends BaseModel<ICardEntity> {
  @observable
  id: string;

  @observable
  token: string;

  @observable
  provider: string;

  @observable
  ownerId: string;

  constructor(newCardInfo: ICardEntity) {
    super(newCardInfo);

    this.id = newCardInfo.id;

    this.token = newCardInfo.token;

    this.provider = newCardInfo.provider;

    this.ownerId = newCardInfo.ownerId;
  }
}

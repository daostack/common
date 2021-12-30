import BaseStore from './BaseStore';
import RootStore from '../RootStore';
import {ICardEntity} from '~/Firebase/Databasee/EntityTypes/ICardEntity';
import {Card} from '../Models/Card';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import CardsService from '~/Services/CardsService';
import Logger from '~/Services/Logger';

export default class CardStore extends BaseStore<Card, ICardEntity> {
  constructor(rootStore: RootStore) {
    super(rootStore);
    this.reset();
  }

  getCardById = (id: string): Card | undefined => {
    try {
      return this.getDataById(id);
    } catch (e) {
      Logger.log('error', e);
    }
  };

  getEntityModel(entity: ICardEntity): Card {
    return new Card(entity);
  }

  reset(): void {
    this.data.clear();
  }

  subscribeToCard = (cardId: string): FirestoreUnsubscribeFn =>
    CardsService.subscribeToCard(cardId, this.updateStoreData);
}

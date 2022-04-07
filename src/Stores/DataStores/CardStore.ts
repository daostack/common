import BaseStore from './BaseStore';
import RootStore from '../RootStore';
import {ICardEntity} from '~/Firebase/Databasee/EntityTypes/ICardEntity';
import {Card} from '../Models/Card';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import CardsService from '~/Services/CardsService';
import Logger from '~/Services/Logger';
import {orderBy} from 'lodash';

export default class CardStore extends BaseStore<Card, ICardEntity> {
  constructor(rootStore: RootStore) {
    super(rootStore);
    this.reset();
  }

  getCardById = (id: string): Card | undefined => {
    try {
      return this.getDataById(id);
    } catch (e) {
      Logger.log('------ cardstore error', e);
    }
  };

  getCards = (ownerId?: string): Array<Card> | undefined => {
    try {
      return this.getDataArray.filter((card) => card.ownerId === ownerId);
    } catch (e) {
      Logger.log('------ cardstore error', e);
    }
  };

  getCurrentCard = (ownerId?: string): Card | undefined => {
    try {
      const cards = this.getCards(ownerId);
      if (cards) {
        return cards.length > 1
          ? orderBy(cards, 'createdAt', 'desc')[0]
          : cards[0];
      }
      return undefined;
    } catch (e) {
      Logger.log('------ cardstore error', e);
    }
  };

  getEntityModel(entity: ICardEntity): Card {
    return new Card(entity);
  }

  reset(): void {
    this.data.clear();
  }

  subscribeToUserCards = (ownerId: string): FirestoreUnsubscribeFn =>
    CardsService.subscribeToUserCards(ownerId, this.updateStoreData);
}

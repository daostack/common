import BaseStore from './BaseStore';
import RootStore from '../RootStore';
import {ICardEntity} from '~/Firebase/Databasee/EntityTypes/ICardEntity';
import {Card} from '../Models/Card';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import CardsService from '~/Services/CardsService';


export default class CardStore extends BaseStore<
  Card,
  ICardEntity
>{

  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  getCardById = (id: string): Card | undefined => {
    try {
      return this.getDataById(id);
    } catch (e) {
      console.log('error', e);
    }
  }

  userCardExists = (ownerId: string) => {
    if (this.data.size !== 0) {
      return this.data.forEach((card) => {
        ownerId === card.ownerId;
      });
    }
    return false;
  }

  getEntityModel(entity: ICardEntity): Card {
    return new Card(entity);
  }

  subscribeToCard = (cardId: string): FirestoreUnsubscribeFn => CardsService.subscribeToCard(cardId, this.updateStoreData);

}

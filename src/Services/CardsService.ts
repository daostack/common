import {IFirebaseSnapshot} from '~/Firebase/types';
import {ICardEntity} from '~/Firebase/Databasee/EntityTypes/ICardEntity';
import {CardsCollection} from '~/Firebase/Databasee/Collections/CardsCollection';
import Logger from '~/Services/Logger';

export type cardLoadCallbackFunc = (
  updatedCard: IFirebaseSnapshot<ICardEntity>,
) => void;

class CardsService {
  fetchCardByOwnerId = async (ownerId: string) => {
    try {
      const card = await CardsCollection.where('ownerId', '==', ownerId)
        .where('provider', '==', 'PAYME')
        .get();
      return card?.docs[0]?.data();
    } catch (e) {
      return null;
    }
  };

  fetchCardById = async (cardId: string) => {
    try {
      const card = (await CardsCollection.doc(cardId).get()).data();
      return card;
    } catch (e) {
      Logger.log('error', e);
      return null;
    }
  };

  subscribeToCard = (cardId: string, callback: cardLoadCallbackFunc) => {
    const cards = CardsCollection.doc(cardId).onSnapshot((snapshot: any) => {
      callback(snapshot);
    });
    return cards;
  };
}

export default new CardsService();

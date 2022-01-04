import {IFirebaseSnapshot} from '~/Firebase/types';
import {ICardEntity} from '~/Firebase/Databasee/EntityTypes/ICardEntity';
import {CardsCollection} from '~/Firebase/Databasee/Collections/CardsCollection';

export type cardLoadCallbackFunc = (
  updatedCard: IFirebaseSnapshot<ICardEntity>,
) => void;

class CardsService {
  fetchCardByOwnerId = async (ownerId: string) => {
    try {
      const card = await CardsCollection.where('ownerId', '==', ownerId).get();
      card.docs[0]?.data();
    } catch (e) {
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

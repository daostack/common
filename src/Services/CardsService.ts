import {IFirebaseSnapshot} from '~/Firebase/types';
import {ICardEntity} from '~/Firebase/Databasee/EntityTypes/ICardEntity';
import {CardsCollection} from '~/Firebase/Databasee/Collections/CardsCollection';


export type cardLoadCallbackFunc = (updatedCard: IFirebaseSnapshot<ICardEntity>) => void;

class CardsService {

  subscribeToCard = (
    cardId: string,
    callback: cardLoadCallbackFunc,
  ) => {
    const cards =
    CardsCollection.doc(cardId)
      .onSnapshot((snapshot: any) => {
        callback(snapshot);
      });

      return cards;
  };

}

export default new CardsService();

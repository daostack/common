import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {db} from '~/Firebase';
import Toast from '~/Util/Toast';
import {IFirebaseSnapshot} from '~/Firebase/types';
import {IDiscussionEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionEntity';

export const subscribeToCard = async (
    userId: string,
    // callback: (value: number) => void,
  ) => {
    const card = db
      .collection(DB_COLLECTIONS.cards)
      .where('userId', '==', userId);

    return card.onSnapshot(
      (snapshot: IFirebaseSnapshot<IDiscussionEntity>) => {
        // callback(snapshot.docs.length);
      },
      (error: string) => Toast.error(error),
    );
  };

import {DB_COLLECTIONS} from '../index';
import {db, firestore} from '../../index';
import { IUserEntity } from '~/Firebase/EntityTypes';


export const UserCollection = db.collection(DB_COLLECTIONS.users);
//TODD: in the react-native invertise SDK there is no implemented withConverter yet. Let's make custom conversion of the typing ?

// .withConverter<IUserEntity>({
//   fromFirestore(snapshot: firestore.FirebaseFirestore.QueryDocumentSnapshot): IUserEntity {
//     return snapshot.data() as IUserEntity;
//   },
//   toFirestore(object: IUserEntity | Partial<IUserEntity>): firestore.FirebaseFirestore.DocumentData {
//     return object;
//   }
// });

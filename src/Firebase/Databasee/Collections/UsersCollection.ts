import {DB_COLLECTIONS} from '../index';
import {db} from '../../index';

export const UsersCollection = db.collection(DB_COLLECTIONS.users);

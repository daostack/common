import {DB_COLLECTIONS} from '../index';
import {db} from '../../index';

export const CommonsCollection = db.collection(DB_COLLECTIONS.commons);

export const CommonsMemberCollection = db.collectionGroup('members');

import {db} from '../Firebase';

export default class FirebaseService {
  async getUser() {
    return db
      .collection('users')
      .doc('fwdzYtFOP9Q8tT65tBaU')
      .collection('userInfo')
      .get()
      .then(snapshots => {
        if (snapshots.empty) {
          return [];
        }
        return snapshots.docs.map(doc => doc.data());
      });
  }
}

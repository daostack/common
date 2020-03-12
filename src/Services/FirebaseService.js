import {db} from '../Firebase';

export default new class FirebaseService {
  async getUser() {
    return db.collection('users')
      .doc('pbNuWYRttv5v6d4ha2TK')
      .collection('user_info')
      .get()
      .then(snapshots => {
        if (snapshots.empty) {
          return [];
        }
        return snapshots.docs.map(doc => doc.data());
      });
  }
}

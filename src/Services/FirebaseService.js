import {db, firebase} from '../Firebase';
const uuid = require('uuid').v4;

export const DB_COLLECTIONS = {
  users: 'users',
  userInfo: 'userInfo',
  proposals: 'proposals',
};

export default class FirebaseService {
  static serviceInstance = null;

  static getInstance = () => {
    if (FirebaseService.serviceInstance == null) {
      FirebaseService.serviceInstance = new FirebaseService();
    }
    return this.serviceInstance;
  };

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

  async getUserById(userId) {
    console.log('getUserById -> ', userId);
    return db
      .collection(DB_COLLECTIONS.users)
      .doc(userId)
      .get()
      .then(snapshots => {
        if (!snapshots) {
          return null;
        }
        return snapshots.data();
      });
  }

  async getUsers() {
    console.log('getUsers-> ');
    return db
      .collection(DB_COLLECTIONS.users)
      .get()
      .then(snapshots => {
        if (snapshots.empty) {
          return [];
        }
        return snapshots.docs.map(doc => {
          return {...{id: doc.id}, ...doc.data()};
        });
      });
  }

  async getDaos() {
    return db.collection('daos').onSnapshot(snapshot => {
      if (snapshot.empty) {
        return [];
      }
      return snapshot.docs.map(doc => {
        return {...{id: doc.id}, ...doc.data()};
      });
    });
  }

  async addUser(googleId, newUser) {
    console.log('addUser -> ', newUser);
    try {
      return db
        .collection(DB_COLLECTIONS.users)
        .doc(googleId)
        .set(newUser)
        .then(ref => {
          return ref;
        });
    } catch (error) {
      console.log('ERROR -> ', error);
    }
  }

  async editUser(userId, user) {
    console.log('editUser -> ', user);
    return db
      .collection(DB_COLLECTIONS.users)
      .doc(userId)
      .update(user)
      .then(ref => {
        //console.log('Edited document with ID: ', ref.id);
      });
  }

  async uploadImage(imageUri) {
    const ext = imageUri.split('.').pop();
    const filename = `${uuid()}.${ext}`;
    const path = `public_img/${filename}`;
    const ref = firebase.storage().ref(path);
    await ref.putFile(imageUri);
    return await ref.getDownloadURL();
  }
}

import { db, storage } from '../Firebase';
import { prepareUserObject } from '../Util';

export const DB_COLLECTIONS = {
  users: 'users',
  userInfo: 'userInfo',
  proposals: 'proposals',
  daos: 'daos',
  discussionMessages: 'discussionMessage',
};

export default class FirebaseService {
  static serviceInstance = null;

  static getInstance = () => {
    if (FirebaseService.serviceInstance == null) {
      FirebaseService.serviceInstance = new FirebaseService();
    }
    return this.serviceInstance;
  };

  async getUserById(userId) {
    return db
      .collection(DB_COLLECTIONS.users)
      .doc(userId)
      .get()
      .then((snapshots) => {
        // console.log('snapshots : ', snapshots);
        if (!snapshots) {
          return null;
        }
        return prepareUserObject(snapshots.data());
      });
  }

  async getUserDaos(userId, safeAddress) {
    if (safeAddress) {
      const user = await this.getUserById(userId);

      safeAddress = user.safeAddress;
    }

    return db
      .collection(DB_COLLECTIONS.daos)
      .where('members', 'array-contains', {
        address: safeAddress,
        userId,
      })
      .get();
  }

  async getUserByAddress(address) {
    console.log('GETTING USER WITH ADDRESS -> ', address);

    return db
      .collection(DB_COLLECTIONS.users)
      .where('safeAddress', '==', address)
      .get()
      .then((snapshots) => {
        if (!snapshots) {
          return null;
        }
        const doc = snapshots.docs[0];
        return { id: doc.id, ...doc.data() };
      });
  }

  async getUsers() {
    console.log('getUsers-> ');
    return db
      .collection(DB_COLLECTIONS.users)
      .get()
      .then((snapshots) => {
        if (snapshots.empty) {
          return [];
        }
        return snapshots.docs.map((doc) => ({ ...{ id: doc.id }, ...doc.data() }));
      });
  }

  async getDaos() {
    return db.collection('daos').onSnapshot((snapshot) => {
      if (snapshot.empty) {
        return [];
      }
      return snapshot.docs.map((doc) => ({ ...{ id: doc.id }, ...doc.data() }));
    });
  }

  async getDaoNameById(daoId) {
    const dao = await db.collection(DB_COLLECTIONS.daos)
      .doc(daoId)
      .get();

    return dao.data().metadata.name;
  }

  async getDaoInfo(dao) {
    const daoCollection = db.collection('daos').doc(dao);
    daoCollection.onSnapshot((daoSnapshot) => {
      console.log(`Received dao snapshot: ${daoSnapshot}`);
    }, (err) => {
      console.log(`Encountered error: ${err}`);
    });
    return db.collection('dao').onSnapshot((snapshot) => {
      if (snapshot.empty) {
        return [];
      }
      return snapshot.docs.map((doc) => ({ ...{ id: doc.id }, ...doc.data() }));
    });
  }

  async addUser(googleId, newUser) {
    console.log('addUser -> ', newUser);
    try {
      return db
        .collection(DB_COLLECTIONS.users)
        .doc(googleId)
        .set(newUser)
        .then((ref) => ref);
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
      .then((ref) => {
        // console.log('Edited document with ID: ', ref.id);
      });
  }

  async uploadImage(imageUri) {
    const ext = imageUri.split('.').pop();
    const timeStamp = new Date().getTime();
    const filename = `img_${timeStamp}.${ext}`;
    const path = `public_img/${filename}`;
    const ref = storage.ref(path);
    await ref.putFile(imageUri);
    return await ref.getDownloadURL();
  }

  async uploadFile(fileUri) {
    const name = fileUri
      .substring(fileUri.lastIndexOf('/') + 1, fileUri.length)
      .split('.')
      .slice(0, -1)
      .join('.');
    const ext = fileUri.split('.').pop();
    const timeStamp = new Date().getTime();
    const filename = `${name}_${timeStamp}.${ext}`;
    const path = `public_file/${filename}`;
    const ref = storage.ref(path);
    await ref.putFile(fileUri);
    return await ref.getDownloadURL();
  }
}

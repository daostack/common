import {storage} from '~/Firebase';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export default class StorageService {
  static serviceInstance = null;

  static getInstance = () => {
    if (StorageService.serviceInstance == null) {
      StorageService.serviceInstance = new StorageService();
    }
    return this.serviceInstance;
  };

  async uploadImage(imageUri) {
    const ext = imageUri.split('.').pop();
    const timeStamp = new Date().getTime();
    const filename = `img_${timeStamp}.${ext}`;
    const path = `public_img/${filename}`;
    const ref = storage.ref(path);
    await ref.putFile(imageUri);
    return await ref.getDownloadURL();
  }

  async getPathForFirebaseStorage(uri, name) {
    if (Platform.OS === 'ios') {
      return uri;
    }

    const dirs = RNFetchBlob.fs.dirs;
    const destPath = `${dirs.DocumentDir}/_${name}`;
    await RNFetchBlob.fs.writeFile(destPath, uri);
    const fileUri = await RNFetchBlob.fs.stat(destPath);
    return `file://${fileUri.path}`;
  }

  async uploadFile(fileUri, name) {
    const path =
      Platform.OS === 'ios'
        ? `public_file/_${name}`
        : await this.getPathForFirebaseStorage(fileUri, name);

    const ref = storage.ref(path);
    const putFilePath = Platform.OS === 'ios' ? fileUri : path;
    await ref.putFile(putFilePath);
    return await ref.getDownloadURL();
  }
}

import {storage} from '~/Firebase';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

class StorageService {
  uploadImage = async (
    imageUri: string,
    storagePath = 'public_img',
  ): Promise<string> => {
    const ext = imageUri.split('.').pop();
    const timeStamp = new Date().getTime();
    const filename = `img_${timeStamp}.${ext}`;
    const path = `${storagePath}/${filename}`;
    const ref = storage.ref(path);
    await ref.putFile(imageUri);
    return await ref.getDownloadURL();
  };

  getPathForFirebaseStorage = async (
    uri: string,
    name: string,
  ): Promise<string> => {
    if (Platform.OS === 'ios') {
      return uri;
    }

    const dirs = RNFetchBlob.fs.dirs;
    const destPath = `${dirs.DocumentDir}/${name}`;
    await RNFetchBlob.fs.writeFile(destPath, uri);
    const fileUri = await RNFetchBlob.fs.stat(destPath);
    return `file://${fileUri.path}`;
  };

  uploadFile = async (
    fileUri: string,
    name: string,
    storagePath = 'public_file',
  ): Promise<string> => {
    const path =
      Platform.OS === 'ios'
        ? `${storagePath}/${name}`
        : await this.getPathForFirebaseStorage(fileUri, name);

    const ref = storage.ref(path);
    const putFilePath = Platform.OS === 'ios' ? fileUri : path;
    await ref.putFile(putFilePath);
    return await ref.getDownloadURL();
  };

  getFilename = (fileUri: string, withExtension = false): string => {
    const ref = storage.refFromURL(fileUri) || '';
    if (withExtension) {
      return ref.name;
    }
    return ref.name.split('.').shift();
  };
}

export default new StorageService();

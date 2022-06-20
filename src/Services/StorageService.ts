import {storage} from '~/Firebase';
import {Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

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

    const destPath = ReactNativeBlobUtil.fs.dirs.CacheDir + `/${name}`;
    await ReactNativeBlobUtil.MediaCollection.copyToInternal(
      uri, // content uri of the entry in the media storage
      destPath, // path to destination the entry should be copied to
    );
    return destPath;
  };

  uploadFile = async (
    fileUri: string,
    name: string,
    storagePath = 'public_file',
  ): Promise<string> => {
    const documentUri = await this.getPathForFirebaseStorage(fileUri, name);

    const ref = storage.ref(`${storagePath}/${name}`);
    await ref.putFile(documentUri);
    return await ref.getDownloadURL();
  };

  deleteFromStorage = async (fileUri: string): Promise<void> => {
    const ref = storage.refFromURL(fileUri);
    ref.delete();
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

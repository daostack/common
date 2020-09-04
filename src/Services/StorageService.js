import { storage } from '~/Firebase';

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

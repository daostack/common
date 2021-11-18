import Logger from '~/Services/Logger';
import {handlePermission} from '~/Util/Permissions';
import ImagePicker, {
  ImagePickerOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {Toast} from '~/Components';
import StorageService from '~/Services/StorageService';
import {flow, makeAutoObservable} from 'mobx';
import {Platform} from 'react-native';

export class ImagePickerUploader {
  pickingImage = false;
  imageUrl: string | null = null;
  private options: ImagePickerOptions;

  constructor(
    options: ImagePickerOptions = {
      title: 'Select profile image',
      quality: 0.7,
      allowsEditing: false,
    },
  ) {
    makeAutoObservable(this);
    this.options = options;
  }

  setImagePickerResponse = flow(function* (
    this: ImagePickerUploader,
    response: ImagePickerResponse,
  ) {
    if (response.didCancel) {
      Logger.log('User cancelled image picker');
    } else if (response.error) {
      // only for ios because android handles this
      Platform.OS === 'ios' && (yield handlePermission());
      Toast.error(response.error);
      Logger.log('ImagePicker Error: ', response.error);
    } else {
      Toast.loading('Uploading...');
      try {
        this.imageUrl = yield StorageService.uploadImage(response.uri);
        Toast.hide();
        Toast.success('Done');
      } catch (error) {
        Toast.error(error);
      }
    }
    this.pickingImage = false;
  });

  pickImage() {
    if (!this.pickingImage) {
      this.pickingImage = true;
      ImagePicker.showImagePicker(this.options, this.setImagePickerResponse);
    }
  }
}

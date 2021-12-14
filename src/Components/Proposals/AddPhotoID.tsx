import React, {useState} from 'react';
import {StyleSheet, Text, Platform, Pressable, View} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import ImagePicker from 'react-native-image-picker';
import StorageService from '~/Services/StorageService';
import logger from '~/Services/Logger';
import {handlePermission} from '~/Util/Permissions';
import Toast from '~/Util/Toast';
import {colors} from '~/Theme';

export function AddPhotoID() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [filename, setFilename] = useState<string>();

  function deleteImage(url: string): void {
    StorageService.deleteFromStorage(url);
    setImageUrl(undefined);
    setFilename(undefined);
  }

  function pickImage(): void {
    const options = {
      quality: 0.7,
      allowsEditing: false,
    };
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        logger.log('User cancelled image picker');
      } else if (response.error) {
        // only for ios because android handles this
        Platform.OS === 'ios' && (await handlePermission());
        Toast.error(response.error);
        logger.log('ImagePicker Error: ', response.error);
      } else {
        Toast.loading('Uploading...');
        StorageService.uploadImage(response.uri, 'private')
          .then((url) => {
            Toast.hide();
            Toast.success('Done');
            setFilename(StorageService.getFilename(url));
            setImageUrl(url);
          })
          .catch((error) => {
            Toast.error(error.toString());
          });
      }
    });
  }

  return (
    <Pressable
      onPress={imageUrl ? null : pickImage}
      style={({pressed}) => [
        imageUrl
          ? {}
          : {
              opacity: pressed ? 0.5 : 1.0,
            },
        styles.container,
      ]}>
      <Icon name="add-avatar" />
      {imageUrl ? (
        <View style={styles.imageNameContainer}>
          <Text style={styles.title}>{filename}</Text>
          <Pressable
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            onPress={() => {
              deleteImage(imageUrl);
            }}>
            <Icon name="delete" color={colors.black} />
          </Pressable>
        </View>
      ) : (
        <Text style={styles.title}>Add photo ID</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: 'rgb(244,246,255)',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 8,
  },
  imageNameContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 11,
    lineHeight: 18,
    color: colors.black,
    marginLeft: 16,
    textAlignVertical: 'center',
  },
});

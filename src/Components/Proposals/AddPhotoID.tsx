import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  Pressable,
  View,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import ImagePicker from 'react-native-image-picker';
import StorageService from '~/Services/StorageService';
import logger from '~/Services/Logger';
import {handlePermission} from '~/Util/Permissions';
import {TAB_BAR_HEIGHT, STATUS_BAR_HEIGHT} from '~/Util/bottomTabHeight';
import Toast from '~/Util/Toast';
import FastImage from 'react-native-fast-image';
import {colors} from '~/Theme';

const {width, height} = Dimensions.get('window');

const ICON_HIT_SLOP = {top: 15, bottom: 15, left: 15, right: 15};

export function AddPhotoID() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [localPath, setLocalPath] = useState<string>();
  const [filename, setFilename] = useState<string>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function showImagePreview() {
    setModalVisible(true);
  }

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
            setLocalPath(response.uri);
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
    <>
      <Pressable
        onPress={imageUrl ? showImagePreview : pickImage}
        style={({pressed}) => [
          {
            opacity: pressed ? 0.5 : 1.0,
          },
          styles.container,
        ]}>
        <Icon name="add-avatar" />
        {imageUrl ? (
          <View style={styles.imageNameContainer}>
            <Text style={styles.title}>{filename}</Text>
            <Pressable
              hitSlop={ICON_HIT_SLOP}
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
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.closeIcon}
            hitSlop={ICON_HIT_SLOP}
            onPress={() => {
              setModalVisible(false);
            }}>
            <Icon name="close" size={28} color={colors.white} />
          </Pressable>
          <FastImage
            resizeMode="cover"
            source={{uri: localPath}}
            style={styles.imagePreview}
          />
          <Pressable
            style={styles.deleteIcon}
            hitSlop={ICON_HIT_SLOP}
            onPress={() => {
              setModalVisible(false);
              deleteImage(imageUrl as string);
            }}>
            <Icon name="delete" size={28} color={colors.white} />
          </Pressable>
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,26,54,0.4)',
  },
  closeIcon: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 24,
    right: 28,
  },
  imagePreview: {
    width: width - 16,
    aspectRatio: 1,
    maxHeight: height - 100,
  },
  deleteIcon: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT - 40,
    right: 28,
  },
});

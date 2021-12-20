import React, {ReactElement, useState} from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  Pressable,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import ImagePicker from 'react-native-image-picker';
import StorageService from '~/Services/StorageService';
import logger from '~/Services/Logger';
import {handlePermission} from '~/Util/Permissions';
import {TAB_BAR_HEIGHT, STATUS_BAR_HEIGHT} from '~/Util/bottomTabHeight';
import Toast from '~/Util/Toast';
import FastImage from 'react-native-fast-image';
import {colors, layout, font} from '~/Theme';

const {width, height} = Dimensions.get('window');

const ICON_HIT_SLOP = {top: 15, bottom: 15, left: 15, right: 15};

type Props = {
  onSelect: (value: string) => void;
};

export function AddPhotoID({onSelect}: Props): ReactElement {
  const [imageUrl, setImageUrl] = useState<string>();
  const [localPath, setLocalPath] = useState<string>();
  const [filename, setFilename] = useState<string>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  async function deleteImage(url: string): Promise<void> {
    if (url) {
      StorageService.deleteFromStorage(url);
    }
    setImageUrl(undefined);
    setFilename(undefined);
    setLocalPath(undefined);
  }

  function pickImage(): void {
    const options = {
      quality: 0.7,
      allowsEditing: false,
    };
    ImagePicker.showImagePicker(options, async (response) => {
      if (imageUrl) {
        await deleteImage(imageUrl);
      }

      if (response.didCancel) {
        logger.log('User cancelled image picker');
      } else if (response.error) {
        // only for ios because android handles this
        Platform.OS === 'ios' && (await handlePermission());
        Toast.error(response.error);
        logger.log('ImagePicker Error: ', response.error);
      } else {
        setLocalPath(response.uri);
        setModalVisible(true);
      }
    });
  }

  function approveImage(): void {
    Toast.loading('Uploading...');
    setLoading(true);
    StorageService.uploadImage(localPath as string, 'private')
      .then((url) => {
        Toast.hide();
        Toast.success('Done');
        setFilename(StorageService.getFilename(url, true));
        setImageUrl(url);
        onSelect(url);
      })
      .catch((error) => {
        Toast.error(error.toString());
      })
      .finally(() => {
        setModalVisible(false);
        setLoading(false);
      });
  }

  console.log('----isLoading', isLoading);

  return (
    <>
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
            style={[styles.iconContainer, styles.closeIcon]}
            hitSlop={ICON_HIT_SLOP}
            onPress={pickImage}>
            <Icon name="camera" size={24} />
          </Pressable>
          <Pressable
            style={[styles.iconContainer, styles.deleteIcon]}
            hitSlop={ICON_HIT_SLOP}
            onPress={() => {
              setModalVisible(false);
              deleteImage(imageUrl as string);
            }}>
            <Icon name="delete" size={24} color={colors.white} />
          </Pressable>
          <FastImage
            resizeMode="cover"
            source={{uri: localPath}}
            style={styles.imagePreview}
          />
          <TouchableOpacity
            style={[styles.btnContainer, styles.btn]}
            onPress={approveImage}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.btnText}>Approve</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  imagePreview: {
    width: width - 16,
    aspectRatio: 1,
    maxHeight: height - 100,
  },
  iconContainer: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 24,
    left: 28,
  },
  deleteIcon: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 24,
    right: 28,
  },
  btnContainer: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT - 42,
  },
  btn: {
    width: width - 48,
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    paddingVertical: 14,
    borderRadius: 32,
    justifyContent: 'center',
    backgroundColor: colors.mainBlue,
  },
  btnText: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
  },
});

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
import {launchImageLibrary} from 'react-native-image-picker';
import StorageService from '~/Services/StorageService';
import logger from '~/Services/Logger';
import {handlePermission} from '~/Util/Permissions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/Util/Toast';
import FastImage from 'react-native-fast-image';
import {colors, layout, font} from '~/Theme';
import {PAYME_TYPE_CODES} from '~/Util/constants/payme';

const {width, height} = Dimensions.get('window');

const ICON_HIT_SLOP = {top: 15, bottom: 15, left: 15, right: 15};

type LegalDocsProps = {
  name?: string;
  legalType: PAYME_TYPE_CODES;
  amount: number;
  mimeType?: string;
  uri?: string;
  downloadURL?: string;
};

type Props = {
  onSelect: (value?: LegalDocsProps) => void;
  error?: boolean;
};

export function AddPhotoID({onSelect, error = false}: Props): ReactElement {
  const [imageUrl, setImageUrl] = useState<string>();
  const [localImage, setLocalImage] = useState<Omit<LegalDocsProps, 'name'>>();
  const [filename, setFilename] = useState<string>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  async function deleteImage(url: string): Promise<void> {
    if (url) {
      StorageService.deleteFromStorage(url);
    }
    setImageUrl(undefined);
    setFilename(undefined);
    setLocalImage(undefined);
    onSelect(undefined);
  }

  function pickImage(): void {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      allowsEditing: false,
    };
    launchImageLibrary(options, async (response) => {
      if (imageUrl) {
        await deleteImage(imageUrl);
      }

      if (response.didCancel) {
        logger.log('User cancelled image picker');
      } else if (response.errorMessage) {
        // only for ios because android handles this
        Platform.OS === 'ios' && (await handlePermission());
        Toast.error(response.errorMessage);
        logger.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const image = response?.assets[0];
        setLocalImage({
          legalType: PAYME_TYPE_CODES['Social Id'],
          uri: image?.uri,
          amount: 0,
          mimeType: image?.type,
        });
        setModalVisible(true);
      }
    });
  }

  function approveImage(): void {
    Toast.loading('Uploading...');
    setLoading(true);
    StorageService.uploadImage(localImage?.uri as string, 'private')
      .then((url) => {
        Toast.hide();
        Toast.success('Done');
        const imageName = StorageService.getFilename(url, true);
        setFilename(imageName);
        setImageUrl(url);
        onSelect({
          mimeType: localImage?.mimeType,
          amount: 0,
          legalType: localImage!.legalType,
          downloadURL: url,
          name: imageName,
        });
      })
      .catch((err) => {
        Toast.error(err.toString());
      })
      .finally(() => {
        setModalVisible(false);
        setLoading(false);
      });
  }

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
          error ? {backgroundColor: colors.orangeBackgroundLight} : {},
        ]}>
        <Icon name={imageUrl ? 'add-avatar-approved' : 'add-avatar'} />
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
            style={[
              styles.iconContainer,
              styles.closeIcon,
              {top: insets.top + 14},
            ]}
            hitSlop={ICON_HIT_SLOP}
            onPress={pickImage}>
            <Icon name="camera" size={24} />
          </Pressable>
          <Pressable
            style={[
              styles.iconContainer,
              styles.deleteIcon,
              {top: insets.top + 14},
            ]}
            hitSlop={ICON_HIT_SLOP}
            onPress={() => {
              setModalVisible(false);
              deleteImage(imageUrl as string);
            }}>
            <Icon name="delete" size={24} color={colors.white} />
          </Pressable>
          <FastImage
            resizeMode="cover"
            source={{uri: localImage?.uri}}
            style={styles.imagePreview}
          />
          <TouchableOpacity
            style={[styles.btn, {bottom: insets.bottom + 42}]}
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
    zIndex: 1000,
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    left: 28,
  },
  deleteIcon: {
    position: 'absolute',
    right: 28,
  },
  btn: {
    position: 'absolute',
    zIndex: 1000,
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

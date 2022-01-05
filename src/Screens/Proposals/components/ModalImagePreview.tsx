import React, {ReactElement, ReactNode} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font, layout} from '~/Theme';

const {width, height} = Dimensions.get('window');

const ICON_HIT_SLOP = {top: 15, bottom: 15, left: 15, right: 15};

type Props = {
  isVisible: boolean;
  pickImage: () => void;
  onDelete: () => void;
  imageUrl: string;
  isLoading?: boolean;
  onPress: () => void;
  buttonText: string;
  children?: ReactNode;
};

export function ModalImagePreview({
  isVisible = false,
  pickImage,
  onDelete,
  imageUrl,
  isLoading = false,
  onPress,
  buttonText,
  children,
}: Props): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="fade" transparent visible={isVisible}>
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
          onPress={onDelete}>
          <Icon name="delete" size={24} color={colors.white} />
        </Pressable>
        <FastImage
          resizeMode="cover"
          source={{uri: imageUrl}}
          style={styles.imagePreview}
        />
        <TouchableOpacity
          style={[styles.btn, {bottom: insets.bottom + 42}]}
          onPress={onPress}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.btnText}>{buttonText}</Text>
          )}
        </TouchableOpacity>
      </View>
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
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

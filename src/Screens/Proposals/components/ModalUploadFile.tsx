import React, {ReactElement} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import {colors, font, layout} from '~/Theme';
import BottomSheetModal from '~/Components/BottomSheetModal';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';

type Props = {
  isVisible: boolean;
  closeSheet: () => void;
  pickImage: () => void;
  launchCamera: (value: GestureResponderEvent) => void;
  pickFile?: (value: GestureResponderEvent) => void;
  isLoading: boolean;
  loaderText?: string;
};

export const ModalUploadFile = ({
  isVisible,
  closeSheet,
  pickImage,
  launchCamera,
  pickFile,
  isLoading,
  loaderText = 'Loading Invoice',
}: Props): ReactElement => (
  <BottomSheetModal
    isVisible={isVisible}
    onClose={closeSheet}
    style={layout.bottomSheetRadius}>
    {isLoading ? (
      <View style={styles.loaderContainer}>
        <Loader color={colors.mainBlue} />
        <Text style={styles.loaderText}>{loaderText}</Text>
      </View>
    ) : (
      <View style={styles.optionsContainer}>
        <TouchableOpacity onPress={launchCamera}>
          <View style={styles.option}>
            <Icon name="camera" color={colors.black} size={16} />
            <Text style={styles.optionText}>Take a photo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.option}>
            <Icon name="picture" color={colors.black} size={16} />
            <Text style={styles.optionText}>Browse Photo Gallery</Text>
          </View>
        </TouchableOpacity>
        {pickFile && (
          <TouchableOpacity onPress={pickFile}>
            <View style={{...styles.option, marginBottom: 90}}>
              <Icon name="file" color={colors.black} size={16} />
              <Text style={styles.optionText}>Upload file</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    )}
  </BottomSheetModal>
);

const styles = StyleSheet.create({
  loaderContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loaderText: {
    ...font.primary.semiBold,
    ...font.fontSize(3),
    color: colors.mainBlue,
    marginBottom: 150,
  },
  optionsContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 30,
  },
  option: {
    flexDirection: 'row',
    marginBottom: 50,
    marginLeft: 10,
    alignItems: 'center',
  },
  optionText: {
    ...font.primary.semiBold,
    ...font.fontSize(3),
    marginLeft: 10,
  },
});

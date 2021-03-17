import React, {ReactElement} from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import ValidationMessage from './ValidationMessage';
import ImagePicker from 'react-native-image-picker';
import Toast from '~/Util/Toast';
import StorageService from '~/Services/StorageService';
import Icon from '~/Assets/iconfont/Icon';
import colors from '~/Theme/colors';
import layout from '~/Theme/layout';
import text from '~/Theme/text';
import {string, func, bool, shape, object, number} from 'prop-types';
import logger from '../../Services/Logger';
import {handlePermission} from '~Util/Permissions';
import {observer} from 'mobx-react';

type Props = {
    errorMessage?: string | boolean;
    value?: string,
    onChangeImage: (value: string) => void;
    onFieldDeleted?: () => void,
    title?: string,
    quality?: number,
    allowsEditing?: boolean,
    isAvatar?: boolean,
    disableEdit?: boolean,
    multiName?: string;
    displayName?: string;
    name?: string;
}

function ImageField({title, quality, allowsEditing, disableEdit, errorMessage, name, displayName, multiName, isAvatar, value,...props}: Props): ReactElement {
  function onChangeValue(url: string): void {
    props.onChangeImage && props.onChangeImage(url);
  }

  function onFieldDeleted(): void {
    if (props.onFieldDeleted) {
      props.onFieldDeleted();
    }
  }

  function pickImage(): void {
    const options = {
      title: title,
      quality: quality || 0.7,
      allowsEditing: allowsEditing || false,
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
        // const source = { uri: response.uri };
        Toast.loading('Uploading...');
        StorageService.getInstance()
          .uploadImage(response.uri)
          .then((url: string): void => {
            Toast.hide();
            Toast.success('Done');
            onChangeValue(url);
          })
          .catch((error: any) => {
            Toast.error(error.toString());
          });
      }
    });
  }

  function renderImage(): ReactElement {
    const imageStyle = isAvatar
      ? styles.formImageFieldStyle
      : styles.formImageFieldGeneralStyle;

    if (value) {
      return (
        <Image
          style={imageStyle}
          resizeMode="cover"
          source={{
            uri: value,
          }}
        />
      );
    } else if (isAvatar) {
      return (
        <View style={styles.imageStyle}>
          <Icon name="account-place-holder" size={100} />
        </View>
      );
    } else {
      return (
        <View style={styles.imageFieldPlaceholderView}>
          <View
            style={{
              borderColor: colors.grey3,
              borderWidth: 2,
              borderRadius: 5,
              padding: 15,
            }}>
            <Icon name="addpicture" size={18} />
          </View>
          <Text
            style={{
              ...text.h2Black,
              ...layout.marginTopM,
              fontSize: 16,
            }}>
            Upload images from your phone
          </Text>
          <Text
            style={{
              ...text.h2Black,
              ...layout.marginTopS,
              ...{fontWeight: 'normal'},
              fontSize: 16,
            }}>
            Get more attention to your proposal
          </Text>
          <View style={layout.flexRow}>
            <TouchableOpacity style={styles.btn} onPress={pickImage}>
              <Text style={[text.buttonblue, {fontSize: 16}]}>Add Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={
            isAvatar
              ? styles.formFieldContainer
              : styles.formFieldContainerGeneral
          }>
          <View>
            {renderImage()}
            {!disableEdit && (isAvatar || value?.length > 0) && (
              <TouchableOpacity
                style={
                  isAvatar
                    ? styles.formImageFieldAddIconAvatar
                    : styles.formImageFieldAddIcon
                }
                onPress={() => {
                  isAvatar ? pickImage() : onFieldDeleted();
                }}>
                <Icon
                  name={isAvatar ? 'addpicture' : 'delete'}
                  size={16}
                  color={colors.white}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ValidationMessage
          errorMessage={errorMessage}
          multiName={multiName}
          invisibleContainer={true}
        />
      </View>
    );
}

ImageField.propTypes = {
  validation: shape({
    name: string,
    formStore: object,
    validateRule: string,
    multiName: string,
    displayName: string,
    customErrorMessage: string,
  }),
  value: string,
  onChangeImage: func,
  onFieldDeleted: func,
  title: string,
  quality: number,
  allowsEditing: bool,
  isAvatar: bool,
  disableEdit: bool,
};

const styles = StyleSheet.create({
  btn: {
    ...layout.marginTopM,
    ...layout.btnOutline,
    flexDirection: 'row',
    marginTop: 40,
    borderRadius: 10,
    backgroundColor: colors.white,
    flexGrow: 0,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  textfield: {
    //minHeight: 48,
    alignSelf: 'stretch',
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,
    paddingHorizontal: 12,
    ...layout.marginTopS,
  },
  formFieldContainer: {
    width: 100,
  },

  formFieldContainerGeneral: {
    width: '100%',
  },

  formImageFieldStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: 'rgba(0, 26, 54, 0.1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    alignSelf: 'center',
  },
  formImageFieldGeneralStyle: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    backgroundColor: colors.paleGrey,
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  imageFieldPlaceholderView: {
    ...layout.content,
    backgroundColor: colors.paleGrey,
    borderRadius: 20,
    marginBottom: 20,
  },

  formImageFieldAddIcon: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },

  formImageFieldAddIconAvatar: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    padding: 2,
    backgroundColor: colors.mainBlue,
    borderWidth: 2,
    borderColor: colors.white,
  },
  imageStyle: {},
});

export default observer(ImageField);

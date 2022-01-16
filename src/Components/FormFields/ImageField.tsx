import React, {useEffect} from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from '~/Util/Toast';
import StorageService from '~/Services/StorageService';
import Icon from '~/Assets/iconfont/Icon';
import colors from '~/Theme/colors';
import layout from '~/Theme/layout';
import text from '~/Theme/text';
import {string, func, bool, shape, number, InferProps} from 'prop-types';
import logger from '../../Services/Logger';
import {handlePermission} from '~/Util/Permissions';
import {observer} from 'mobx-react';

const props = {
  onChangeImage: func,
  allowsEditing: bool,
  onFieldDeleted: func,
  title: string,
  value: string,
  quality: number,
  isAvatar: bool,
  disableEdit: bool,
  validation: shape({
    name: string,
    formStore: shape({
      registerFormField: func,
      fieldChanged: func,
      getFormField: func,
      removeFormField: func,
    }).isRequired,
    validateRule: string,
    multiName: string,
    displayName: string,
    customErrorMessage: string,
  }),
};

const ImageField: React.FC<InferProps<typeof props>> = observer(
  ({
    onChangeImage,
    allowsEditing,
    onFieldDeleted,
    title,
    value,
    quality,
    isAvatar,
    validation,
    disableEdit,
  }) => {
    let fieldValidation = null;

    useEffect(() => {
      if (validation) {
        const {
          name,
          formStore,
          validateRule,
          multiName,
          displayName,
          customErrorMessage,
        } = validation;

        formStore?.registerFormField(name, validateRule, value, multiName);

        fieldValidation = (
          <ValidationMessage
            displayName={displayName}
            customErrorMessage={customErrorMessage}
            formStore={formStore}
            name={name}
            multiName={multiName}
            invisibleContainer={true}
          />
        );
      }
    }, []);

    const onChangeValue = (url: string) => {
      const {formStore, name, multiName} = validation;
      formStore.fieldChanged(name, url, false, multiName);
      onChangeImage && onChangeImage(url);
    };

    const thisOnFieldDeleted = () => {
      if (onFieldDeleted) {
        onFieldDeleted();
      } else {
        const {formStore, name} = validation;
        formStore.removeFormField(name);
      }
    };

    const pickImage = () => {
      const options = {
        title,
        quality: quality || 0.7,
        allowsEditing: allowsEditing || false,
      };
      launchImageLibrary(options, async (response) => {
        if (response.didCancel) {
          logger.log('User cancelled image picker');
        } else if (response.errorMessage) {
          // only for ios because android handles this
          Platform.OS === 'ios' && (await handlePermission());
          Toast.error(response.errorMessage);
          logger.log('ImagePicker Error: ', response.errorMessage);
        } else {
          // const source = { uri: response.uri };
          Toast.loading('Uploading...');
          StorageService.uploadImage(response?.assets[0]?.uri)
            .then((url) => {
              Toast.hide();
              Toast.success('Done');
              onChangeValue(url);
            })
            .catch((error) => {
              Toast.error(error.toString());
            });
        }
      });
    };

    const renderImage = () => {
      const imageStyle = isAvatar
        ? styles.formImageFieldStyle
        : styles.formImageFueldGeneralStyle;

      const currValue =
        validation?.formStore.getFormField(
          validation.name,
          validation.multiName,
        )?.value || value;

      if (currValue) {
        return (
          <Image
            style={imageStyle}
            resizeMode="cover"
            source={{
              uri: currValue,
            }}
          />
        );
      } else if (isAvatar) {
        return (
          <View style={imageStyle}>
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
            <View styles={layout.flexRow}>
              <TouchableOpacity style={styles.btn} onPress={pickImage}>
                <Text style={[text.buttonblue, {fontSize: 16}]}>Add Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    };

    const currValue =
      validation?.formStore?.getFormField(validation.name, validation.multiName)
        ?.value || value;

    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={
            isAvatar
              ? styles.formFieldContainer
              : styles.formFieldContainerGenral
          }>
          <View>
            {renderImage()}
            {!disableEdit && (isAvatar || currValue?.length > 0) && (
              <TouchableOpacity
                style={
                  isAvatar
                    ? styles.formImageFielAddIconAvatar
                    : styles.formImageFielAddIcon
                }
                onPress={() => {
                  isAvatar ? pickImage() : thisOnFieldDeleted();
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
        {fieldValidation}
      </View>
    );
  },
);

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
  formFieldContainer: {
    width: 100,
  },

  formFieldContainerGenral: {
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
  formImageFueldGeneralStyle: {
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

  formImageFielAddIcon: {
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

  formImageFielAddIconAvatar: {
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
});

export default ImageField;

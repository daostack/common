import * as React from 'react';
import {Image, View, StyleSheet, TouchableOpacity, Text, Platform} from 'react-native';

import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';

import ImagePicker from 'react-native-image-picker';
import Toast from '../../Util/Toast';
import StorageService from '../../Services/StorageService';

import Icon from '../../Assets/iconfont/Icon';
import colors from '../../Theme/colors';
import layout from '../../Theme/layout';
import text from '../../Theme/text';

class ImageField extends React.Component {
  fieldValidation = null;
  placeFieldActionComponent = null;

  static defaultProps;

  constructor(props) {
    super(props);

    const {validation, value} = this.props;

    if (validation) {
      const {name, formStore, validateRule, multiName, displayName, customErrorMessage} = validation;
      formStore.registerFormField(name, validateRule, value, multiName);

      this.fieldValidation = (
        <ValidationMessage displayName={displayName} customErrorMessage={customErrorMessage} formStore={formStore} name={name} invisibleContainer={true}/>
      );
    }
  }

  onChangeValue = url => {
    if (this.props.validation) {
      const {formStore, name} = this.props.validation;
      formStore.fieldChanged(name, url);
    }
    this.props.onChangeImage && this.props.onChangeImage(url);
  };

  onFieldDeleted = () => {
    if (this.props.validation) {
      const { formStore, name } = this.props.validation;
      formStore.removeFormField(name);
    }
    this.props.onFieldDeleted && this.props.onFieldDeleted();
  }

  pickImage = () => {
    const {title, quality, allowsEditing} = this.props;
    const options = {
      title: title,
      quality: quality || 0.7,
      allowsEditing: allowsEditing || false,
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        Toast.error(response.error);
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const source = { uri: response.uri };
        Toast.loading('Uploading...');
        StorageService.getInstance()
          .uploadImage(response.uri)
          .then(url => {
            Toast.hide();
            Toast.success('Done');
            this.onChangeValue(url);
          })
          .catch(error => Toast.error(error.toString()));
      }
    });
  };

  renderImage = () => {
    const {isAvatar, validation, value} = this.props;

    const imageStyle = isAvatar
      ? styles.formImageFieldStyle
      : styles.formImageFueldGeneralStyle;

    const currValue = validation
      ? validation.formStore.form.fields[validation.name].value
      : value;

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
    }
    else if (isAvatar){
      return (
        <View style={styles.imageStyle}>
          <Icon name="account-place-holder" size={100} />
        </View>
      );
    }
    else {
      return (
        <View style={styles.imageFieldPlaceholderView}>
          <View style={{ borderColor: colors.grey3, borderWidth: 2, borderRadius: 5, padding: 15}}>
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
            <TouchableOpacity style={styles.btn} onPress={this.pickImage} >
              <Text style={[text.buttonblue, {fontSize: 16}]}>Add Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  render() {
    const {isAvatar, value, validation, disableEdit} = this.props;

    const currValue = validation
      ? validation.formStore.form.fields[validation.name].value
      : value;

    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={
            isAvatar
              ? styles.formFieldContainer
              : styles.formFieldContainerGenral
          }>
          <View>
            {this.renderImage()}
            {!disableEdit && (isAvatar || currValue) ? (
              <TouchableOpacity
                style={isAvatar ? styles.formImageFielAddIconAvatar : styles.formImageFielAddIcon}
                onPress={() => { isAvatar ? this.pickImage() : this.onFieldDeleted();} }>
                <Icon name={ isAvatar ? 'addpicture' : 'delete' } size={16} color={colors.white} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {this.fieldValidation}
      </View>
    );
  }
}

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
  },
  imageFieldPlaceholderView: {
    ...layout.content,
    backgroundColor: colors.paleGrey,
    borderRadius: 20,
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

export default observer(ImageField);

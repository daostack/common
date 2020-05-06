import * as React from 'react';
import {Image, View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';

import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Toast from '../../Util/Toast';
import FirebaseService from '../../Services/FirebaseService';

import Icon from '../../Assets/iconfont/Icon';
import {text, layout, colors, sizeM, sizeXS} from '../../Theme';

const firebaseService = new FirebaseService();

class FileField extends React.Component {
  fieldValidation = null;
  placeFieldActionComponent = null;

  static defaultProps;

  constructor(props) {
    super(props);

    const {validation, value} = this.props;
    this.toast = new Toast();

    if (validation) {
      const {name, formStore, validateRule} = validation;
      console.log('====== REGISTER FIELD NAME ======');
      console.log(name, value);
      formStore.registerFormField(name, validateRule, value);
      this.fieldValidation = (
        <ValidationMessage formStore={formStore} name={name} />
      );
    }
  }

  onChangeValue = fileName => {
    if (this.props.validation) {
      const {formStore, name} = this.props.validation;
      formStore.fieldChanged(name, fileName);
    }
    this.props.onChangeFile && this.props.onChangeFile(fileName);
  };

  pickImage = async () => {
    console.log('AAAA');

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );

      this.onChangeValue(res.name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }

    /*
    const {title, quality, allowsEditing} = this.props;
    const options = {
      title: title,
      quality: quality || 0.7,
      allowsEditing: allowsEditing || false,
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        this.toast.error(response.error);
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const source = { uri: response.uri };
        this.toast.loading('Uploading...');
        firebaseService
          .uploadImage(response.uri)
          .then(url => {
            this.toast.hide();
            this.toast.done('Done');
            this.onChangeValue(url);
          })
          .catch(error => this.toast.error(error));
      }
    });
    */
  };

  renderImage = () => {
    const {validation} = this.props;

    const currValue = validation
      ? validation.formStore.form.fields[validation.name].value
      : value;

    console.log(validation.formStore.form.fields[validation.name].value);

    console.log('CurrValue -> ', currValue);

    if (currValue) {
      return (
        <View style={styles.adRow}>
          <Icon name="common" color={colors.mainBlue} size={22} />
          <Text style={styles.adsText}>{currValue}</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity>
          <Text style={styles.addFileBtn} onPress={this.pickImage}>
            Add File
          </Text>
        </TouchableOpacity>
      );
    }
  };

  render() {
    const {isAvatar, value, validation} = this.props;

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
            {isAvatar || currValue ? (
              <TouchableOpacity
                style={styles.formImageFielAddIcon}
                onPress={this.pickImage}>
                <Icon name="edit" size={16} color={colors.white} />
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
  adsText: {
    ...text.h3Black,
    ...layout.marginLeftXS,
    fontWeight: '500',
  },
  adRow: {
    ...layout.flexRow,
    alignSelf: 'stretch',
    paddingVertical: sizeM,
  },
  btn: {
    ...layout.marginTopM,
    ...layout.btnOutline,
    flexDirection: 'row',
    marginTop: 40,
    borderRadius: 5,
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
  },

  formImageFielAddIcon: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
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

  imagePlaceholder: {
    ...layout.content,
    ...layout.marginTopXL,
    backgroundColor: '#effafd',
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  addFileBtn: {
    ...text.h3Black,
    color: colors.mainBlue,
    textAlign: 'left',
  },
});

export default observer(FileField);

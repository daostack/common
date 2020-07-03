import * as React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import DocumentPicker from 'react-native-document-picker';
import Toast from '../../Util/Toast';
import Icon from '../../Assets/iconfont/Icon';
import {text, layout, colors, sizeM} from '../../Theme';
import FirebaseService from '../../Services/FirebaseService';

class FileField extends React.Component {
  fieldValidation = null;
  placeFieldActionComponent = null;
  static defaultProps;

  constructor(props) {
    super(props);

    const {validation, value} = this.props;

    if (validation) {
      const {name, formStore, validateRule, multiName} = validation;
      formStore.registerFormField(name, validateRule, value, multiName);

      this.fieldValidation = (
        <ValidationMessage formStore={formStore} name={name} />
      );
    }
  }

  onChangeValue = fileUrl => {
    if (this.props.validation) {
      const {formStore, name} = this.props.validation;
      formStore.fieldChanged(name, fileUrl);
    }
    this.props.onChangeFile && this.props.onChangeFile(fileUrl);
  };

  onFieldDeleted = () => {
    if (this.props.validation) {
      const { formStore, name} = this.props.validation;
      formStore.removeFormField(name);
    }
    this.props.onFieldDeleted && this.props.onFieldDeleted();
  }

  pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      // console.log(
      //   res.uri,
      //   res.type, // mime type
      //   res.name,
      //   res.size,
      // );

      Toast.loading('Uploading...');
      const downloadUrl = await FirebaseService.getInstance().uploadFile(
        res.uri,
      );
      console.log('downloadUrl', downloadUrl);
      Toast.done('Success');
      this.onChangeValue(downloadUrl);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  renderFile = () => {
    const {validation, navigation, value} = this.props;

    const currValue = validation
      ? validation.formStore.form.fields[validation.name].value
      : value;


    const fileName = currValue
      .substring(currValue.lastIndexOf('/') + 1, currValue.length)
      .split('?')[0]
      .split('_')
      .slice(0, -1)
      .join('_')
      .replace('public_file%2F', '');

    const ext = currValue
      .substring(currValue.lastIndexOf('/') + 1, currValue.length)
      .split('?')[0]
      .split('.')
      .pop();

    if (currValue) {
      return (
        <View style={styles.adRow}>
          <Icon name="common" color={colors.mainBlue} size={22} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Browser', {
                url: currValue,
              });
            }}>
            <Text style={styles.adsText}>{`${fileName}.${ext}`}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableOpacity>
          <Text style={styles.addFileBtn} onPress={this.pickFile}>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {this.renderFile()}
            {isAvatar || currValue ? (
              <TouchableOpacity
                style={styles.formImageFielAddIcon}
                onPress={() => this.onFieldDeleted()}>
                <Icon name="delete" size={16} color={'rgb(0, 26, 54, 0.5)'} />
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
    width: 30,
    height: 30,
    borderRadius: 15,
    padding: 2,
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

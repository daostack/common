import * as React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import DocumentPicker from 'react-native-document-picker';
import Toast from '../../Util/Toast';
import Icon from '../../Assets/iconfont/Icon';
import {text, layout, colors, font} from '../../Theme';
import StorageService from '../../Services/StorageService';

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
      const downloadUrl = await StorageService.getInstance().uploadFile(
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
          <Icon name="file" color={colors.mainBlue} size={20} />
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
        <TouchableOpacity onPress={this.pickFile}>
          <Text style={styles.addFileBtn} >
            Add File
          </Text>
        </TouchableOpacity>
      );
    }
  };

  render() {
    const { value, validation} = this.props;

    const currValue = validation
      ? validation.formStore.form.fields[validation.name].value
      : value;

    return (
      <View style={styles.container}>
        <View
          style={styles.formFieldContainerGenral}>
          <View style={styles.fileContainer}>
            {this.renderFile()}
            {currValue ? (
              <TouchableOpacity
                onPress={() => this.onFieldDeleted()}>
                <Icon name="delete" size={16} />
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
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adsText: {
    ...text.h3Black,
    ...layout.marginLeftXS,
    textDecorationLine: 'underline',
  },
  adRow: {
    ...layout.flexRow,
    alignSelf: 'stretch',
  },
  formFieldContainer: {
    width: 100,
  },

  formFieldContainerGenral: {
    width: '100%',
  },
  addFileBtn: {
    ...font.fontSize(2),
    ...font.primary.semiBold,
    color: colors.mainBlue,
    textAlign: 'left',
  },
});

export default observer(FileField);

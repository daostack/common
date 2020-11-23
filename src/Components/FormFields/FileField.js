import * as React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import ValidationMessage from './ValidationMessage';
import {observer} from 'mobx-react';
import DocumentPicker from 'react-native-document-picker';
import Toast from '~/Util/Toast';
import Icon from '~/Assets/iconfont/Icon';
import {text, layout, colors} from '~/Theme';
import StorageService from '~/Services/StorageService';
import logger from '../../Services/Logger';
import {string, func, object, shape, oneOfType} from 'prop-types';

class FileField extends React.Component {
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
        <ValidationMessage displayName={displayName} customErrorMessage={customErrorMessage} formStore={formStore} name={name} multiName={multiName}/>
      );
    }
  }

  onChangeValue = (fileUrl) => {
    if (this.props.validation) {
      const {formStore, name, multiName} = this.props.validation;
      formStore.fieldChanged(name, fileUrl, false, multiName);
    }
    this.props.onChangeFile && this.props.onChangeFile(fileUrl);
  };

  onFieldDeleted = () => {
    if (this.props.onFieldDeleted) {
      this.props.onFieldDeleted();
    } else {
      if (this.props.validation) {
        const {formStore, name} = this.props.validation;
        formStore.removeFormField(name);
      }
    }
  }

  pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      // logger.log(
      //   res.uri,
      //   res.type, // mime type
      //   res.name,
      //   res.size,
      // );

      Toast.loading('Uploading...');
      const downloadUrl = await StorageService.getInstance().uploadFile(
        res.uri,
        res.name
      );
      logger.log('downloadUrl', downloadUrl);
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
      ? validation.formStore.getFormField(validation.name, validation.multiName)?.value
      : value;

    if (currValue) {
      let fileName = currValue.split('_');
      fileName = fileName[fileName.length - 2];

      return (
        <View style={styles.adRow}>
          <Icon name="file" color={colors.mainBlue} size={20} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Browser', {
                url: currValue,
              });
            }}>
            <Text style={styles.adsText}>{fileName}</Text>
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
    const {value, validation} = this.props;

    const currValue = validation
      ? validation.formStore.getFormField(validation.name, validation.multiName)?.value
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

FileField.propTypes = {
  validation: shape({
    name: string,
    formStore: object,
    validateRule: oneOfType([
      string,
      object,
    ]),
    multiName: string,
    displayName: string,
    customErrorMessage: string,
  }),
  value: string,
  onChangeFile: func,
  navigation: object,
  onFieldDeleted: func,
};

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
    maxWidth: '90%',
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
    ...text.h3Black,
    color: colors.mainBlue,
    textAlign: 'left',
    ...layout.marginTopS,
    fontSize: 16,
  },
});

export default FileField;

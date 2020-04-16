import * as React from 'react';
import {Image, ImageProps, View, StyleSheet, ViewStyle} from 'react-native';

import ValidationMessage from './ValidationMessage';
import {observer, inject} from 'mobx-react';

import PhotoUpload from 'react-native-photo-upload';

import Icon from '../../Assets/iconfont/Icon';
import colors from '../../Theme/colors';
import layout from '../../Theme/layout';

class ImageField extends React.Component {
  fieldValidation = null;
  placeFieldActionComponent = null;

  static defaultProps;

  constructor(props) {
    super(props);

    const {validation, value} = this.props;

    if (validation) {
      const {name, formStore, validateRule} = validation;
      formStore.registerFormField(name, validateRule, value);
      this.fieldValidation = (
        <ValidationMessage formStore={formStore} name={name} />
      );
    }
  }

  onChangeValue = base64Value => {
    if (this.props.validation) {
      const {formStore, name} = this.props.validation;
      formStore.fieldChanged(name, base64Value);
    }
    this.props.onChangeImage && this.props.onChangeImage(base64Value);
    this.setState({});
  };

  renderImage = () => {
    const {value, validation, placeholderUrl} = this.props;

    const currValue = validation
      ? validation.formStore.form.fields[validation.name].value
      : value;

    if (currValue) {
      return (
        <Image
          style={styles.formImageFieldStyle}
          resizeMode="cover"
          source={{
            uri: `data:image/png;base64,${currValue}`,
          }}
        />
      );
    } else {
      return (
        <Image
          style={styles.formImageFieldStyle}
          resizeMode="cover"
          source={{uri: placeholderUrl}}
        />
      );
    }
  };

  render() {
    const {
          value,
          viewStyle,

          // Validation management properties
          validation,

          ...otherProps
        } = this.props;

    return (
      <View>
        <View style={styles.formFieldContainer}>
          <PhotoUpload onPhotoSelect={this.onChangeValue}>
            {this.renderImage()}
            <View style={styles.formImageFielAddIcon}>
              <Icon name="edit" size={16} color={colors.white} />
            </View>
          </PhotoUpload>
        </View>

        {this.fieldValidation}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  formFieldContainer: {},

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
  },

  formImageFielAddIcon: {
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

  imagePlaceholder: {
    ...layout.content,
    ...layout.marginTopXL,
    backgroundColor: '#effafd',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default observer(ImageField);

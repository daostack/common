import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import { text, layout, colors, sizeL } from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const MultiLinkField = props => {
  const [count, setCount] = useState(1);
  const [deletedFields, setDeletedFields] = useState([]);

  const {
    maxCount,
    validation,
    placeholderValueText,
    multiline,
    addMultiFieldBtnName,
    maxLength,
  } = props;

  // let fieldName = null;

  useEffect(() => {
    // fieldName = validation.name;
  }, []);

  const onFieldDeleted = (currIndex, currTitleItemValidation, currItemValidation) => {
    if (currTitleItemValidation && currItemValidation) {
      currTitleItemValidation.formStore.removeFormField(currTitleItemValidation.name);
      currItemValidation.formStore.removeFormField(currItemValidation.name);
    }
    setDeletedFields([...deletedFields, currIndex]);
  };

  const onChangeText = (value, currTitleItemValidation) => {
    if (value.length > 0) {
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule + '|required');
    } else {
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule);
    }

  };

  const renderAddLinkBtn = index => {
    if (!maxCount || (count - deletedFields.length) < maxCount) {
      return (
        <TouchableOpacity>
          <Text style={styles.addLinkBtn} onPress={() => setCount(count + 1)}>
            {addMultiFieldBtnName ? addMultiFieldBtnName : 'Add Link'}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderRemoveLinkBtn = (index, currTitleItemValidation, currItemValidation) => {
    return (
      <TouchableOpacity
        style={styles.removeBtnContainer}
        onPress={() => onFieldDeleted(index, currTitleItemValidation, currItemValidation)}>
        <Icon name="delete" size={16} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{paddingTop: sizeL}}>
      {[...Array(count).keys()].map(currIndex => {
        const currItemValidation = {...props.validation}; //{...validation};
        currItemValidation.name = `${props.validation.name}_value_${currIndex +
          1}`;
        currItemValidation.multiName = props.validation.name;
        currItemValidation.validateRule =
          validation.validateRule?.common || validation.validateRule;
        currItemValidation.invisibleContainer = true;

        const currTitleItemValidation = {...props.validation}; //{...validation};
        currTitleItemValidation.name = `${
          props.validation.name
        }_title_${currIndex + 1}`;
        currTitleItemValidation.multiName = props.validation.name;
        currTitleItemValidation.validateRule =
          validation.validateRule?.title || 'string';
        const { formStore } = validation;
        currTitleItemValidation.topPosition = true;
        currTitleItemValidation.invisibleContainer = true;

        return (
          !deletedFields.includes(currIndex) && <View key={`key_${props.validation.name}_${currIndex + 1}`} style={layout.marginBottomM}>
            {props.title ? (
              <TextInputField
                label={props.label}
                viewStyle={{marginTop: 0}}
                placeholderText={props.title}
                validation={currTitleItemValidation}
                maxLength = {maxLength}
              />
            ) : null}
            <TextInputField
              value={''}
              onChangeText={value => onChangeText(value, currTitleItemValidation)}
              viewStyle={{marginTop: 0}}
              placeholderText={
                placeholderValueText ? placeholderValueText : 'https://'
              }
              autoCapitalize="none"
              autoCorrect={false}
              multiline={multiline}
              validation={currItemValidation}
            />
            <View style={styles.removeBtn}>
              {renderRemoveLinkBtn(currIndex, currTitleItemValidation, currItemValidation)}
            </View>
          </View>
        );
      })}

      {renderAddLinkBtn()}
    </View>
  );
};

const styles = StyleSheet.create({
  removeBtnContainer: {
    borderRadius: 15,
    width: 30,
    height: 30,
    backgroundColor: `${colors.black}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
  },
  containerRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 80,
  },
  emailContainer: {
    ...layout.content,
    ...layout.marginBottomXL,
    marginTop: 0,
  },
  addLinkBtn: {
    ...text.h3Black,
    color: colors.mainBlue,
    textAlign: 'left',
    fontSize: 16,
  },
});

export default MultiLinkField;

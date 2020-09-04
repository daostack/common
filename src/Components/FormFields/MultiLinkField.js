import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import TextInputField from './TextInputField';
import { text, layout, colors, sizeL } from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';

const MultiLinkField = (props) => {
  const [ count, setCount ] = useState(1);
  const [ deletedFields, setDeletedFields ] = useState([]);

  const {
    maxCount,
    validation,
    placeholderValueText,
    multiline,
    addMultiFieldBtnName,
    maxLength
  } = props;

  const onFieldDeleted = (currIndex, currTitleItemValidation, currItemValidation) => {
    if (currTitleItemValidation && currItemValidation) {
      currTitleItemValidation.formStore.removeFormField(currTitleItemValidation.name);
      currItemValidation.formStore.removeFormField(currItemValidation.name);
    }
    setDeletedFields([ ...deletedFields, currIndex ]);
  };

  const onChangeText = (value, currTitleItemValidation) => {
    if (value.length > 0) {
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule + '|required');
    } else {
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule);
    }
  };

  const AddLinkBtn = ({ addMultiFieldBtnName, setCount }) => (
    <TouchableOpacity>
      <Text style={styles.addLinkBtn} onPress={() => setCount()}>
        {addMultiFieldBtnName || 'Add Link'}
      </Text>
    </TouchableOpacity>
  );

  const RemoveLinkBtn = ({ onFieldDeleted }) => (
    <TouchableOpacity
      style={styles.removeBtnContainer}
      onPress={() => onFieldDeleted()}>
      <Icon name="delete" size={16}/>
    </TouchableOpacity>
  );

  const canAddMoreLinks = () => {
    let addMore = true;

    [ ...Array(count).keys() ].forEach((i) => {
      if (
        validation.formStore.form.fields[`${props.validation.name}_value_${i + 1}`]?.error ||
        !Boolean(validation.formStore.form.fields[`${props.validation.name}_value_${i + 1}`]?.value)
      ) {
        addMore = false;
      }

      if (
        validation.formStore.form.fields[`${props.validation.name}_value_${i + 1}`]?.error ||
        !Boolean(validation.formStore.form.fields[`${props.validation.name}_value_${i + 1}`]?.value)
      ) {
        addMore = false;
      }
    });

    return addMore;
  };

  return (
    <View style={{ paddingTop: sizeL }}>
      {[ ...Array(count).keys() ].map((currIndex) => {
        const currItemValidation = {
          ...props.validation,
          name: `${props.validation.name}_value_${currIndex + 1}`,
          multiName: props.validation.name,
          validateRule: validation.validateRule?.common || validation.validateRule,
          invisibleContainer: true
        }; //{...validation};


        const currTitleItemValidation = {
          ...props.validation,
          name: `${props.validation.name}_title_${currIndex + 1}`,
          multiName: props.validation.name,
          validateRule: validation.validateRule?.title || 'string',
          topPosition: true,
          invisibleContainer: true
        }; //{...validation};

        const { formStore } = validation;

        return (
          !deletedFields.includes(currIndex) && (
            <View key={`key_${props.validation.name}_${currIndex + 1}`} style={layout.marginBottomM}>
              {props.title && (
                <TextInputField
                  label={props.label}
                  viewStyle={{ marginTop: 0 }}
                  placeholderText={props.title}
                  validation={currTitleItemValidation}
                  maxLength={maxLength}
                />
              )}

              <TextInputField
                value={''}
                onChangeText={(value) => onChangeText(value, currTitleItemValidation)}
                viewStyle={{ marginTop: -5 }}
                placeholderText={
                  placeholderValueText
                    ? placeholderValueText
                    : 'https://'
                }
                autoCapitalize="none"
                autoCorrect={false}
                multiline={multiline}
                validation={currItemValidation}
              />
            </View>
          )
        );
      })}

      {
        ((!maxCount || (count - deletedFields.length) < maxCount) && canAddMoreLinks()) && (
          <AddLinkBtn setCount={() => setCount(count + 1)}/>
        )
      }
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
    alignItems: 'center'
  },
  removeBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center'
  },
  containerRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 80
  },
  emailContainer: {
    ...layout.content,
    ...layout.marginBottomXL,
    marginTop: 0
  },
  addLinkBtn: {
    ...text.h3Black,
    color: colors.mainBlue,
    textAlign: 'left',
    fontSize: 16
  }
});

export default MultiLinkField;

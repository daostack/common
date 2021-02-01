import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import {text, layout, colors, sizeL} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {string, bool, object, number, shape, oneOfType, func} from 'prop-types';

const RemoveLinkBtn = ({onFieldDeleted}) => (
  <TouchableOpacity
    style={styles.removeBtnContainer}
    onPress={() => onFieldDeleted()}>
    <Icon name="delete" size={16} />
  </TouchableOpacity>
);

const MultiLinkField = (props) => {
  const {
    maxCount,
    validation,
    placeholderValueText,
    multiline,
    addMultiFieldBtnName,
    maxLength,
    link = false,
    rule = false,
  } = props;

  const [count, setCount] = useState(1);
  const [addButton, setAddButton] = useState(false);
  let currRules = props?.currRules || [];

  useEffect(() => {
    const currFormField = validation.formStore.getFormField(validation.name);
    if (currFormField) {
      setCount(
        props?.currRules
          ? Object.keys(props?.currRules)?.length
          : Object.keys(currFormField)?.length,
      );
      currRules = rule ? currRules || currFormField : [];
    }

    canAddMore();
  }, []);

  const onFieldDeleted = (currIndex) => {
    setCount(count - 1);
    if (props.validation) {
      props.validation.formStore.removeFormField(
        props.validation.name,
        currIndex,
      );
    }
    props.onChangeText && props.onChangeText(currIndex);
  };

  const onChangeText = (value, currTitleItemValidation, index) => {
    if (value.length > 0) {
      validation.formStore.updateFieldValidationRule(
        currTitleItemValidation.name,
        currTitleItemValidation.multiName,
        currTitleItemValidation.validateRule + '|required',
        true,
      );
    } else {
      validation.formStore.updateFieldValidationRule(
        currTitleItemValidation.name,
        currTitleItemValidation.multiName,
        currTitleItemValidation.validateRule,
        true,
      );
    }
    props.onChangeText && props.onChangeText(index);
    canAddMore();
  };

  const AddBtn = ({}) => (
    <TouchableOpacity>
      <Text
        style={styles.addLinkBtn}
        onPress={() => {
          setCount(count + 1);
          setAddButton(false);
        }}>
        {addMultiFieldBtnName ||
          (link ? 'Add Link' : rule ? 'Add rule' : 'Add field')}
      </Text>
    </TouchableOpacity>
  );

  const canAddMore = () => {
    let canAdd = true;
    [...Array(count).keys()].forEach((i) => {
      let {error, value} = validation?.formStore?.getFormField(
        `${i}_value`,
        validation.name,
      );
      if (!value || typeof error === 'string') {
        canAdd = false;
      }
    });

    setAddButton(canAdd);
  };

  return (
    <View style={{paddingTop: sizeL}}>
      {[...Array(count).keys()].map((currIndex) => {
        const currItemValidation = {
          ...props.validation,
          name: `${currIndex}_value`,
          multiName: props.validation.name,
          validateRule:
            validation.validateRule?.common || validation.validateRule,
          invisibleContainer: true,
          immediateValidation: true,
          customErrorMessage: 'Link format is invalid',
        }; //{...validation};

        const currTitleItemValidation = {
          ...props.validation,
          name: `${currIndex}_title`,
          multiName: props.validation.name,
          validateRule: validation.validateRule?.title || 'string',
          topPosition: true,
          invisibleContainer: true,
          immediateValidation: true,
          customErrorMessage: 'Link title is required',
        };

        return (
          <View
            key={`key_${props.validation.name}_${currIndex}`}
            style={layout.marginBottomM}>
            {props.title && (
              <TextInputField
                value={
                  currTitleItemValidation.formStore.getFormField(
                    currTitleItemValidation.name,
                    currTitleItemValidation.multiName,
                  )?.value || currRules[currIndex]?.title
                }
                label={props.label}
                onChangeText={(value) => {
                  onChangeText(value, currItemValidation, currIndex);
                }}
                viewStyle={{marginTop: 0}}
                placeholderText={props.title}
                validation={currTitleItemValidation}
                maxLength={maxLength}
              />
            )}

            <TextInputField
              value={
                currItemValidation.formStore.getFormField(
                  currItemValidation.name,
                  currItemValidation.multiName,
                )?.value || currRules[currIndex]?.value
              }
              onChangeText={(value) => {
                onChangeText(value, currTitleItemValidation, currIndex);
              }}
              viewStyle={{marginTop: -5}}
              placeholderText={
                placeholderValueText ? placeholderValueText : 'https://'
              }
              autoCapitalize="none"
              autoCorrect={false}
              multiline={multiline}
              validation={currItemValidation}
            />
            {count > currIndex && (
              <View style={styles.removeBtn}>
                <RemoveLinkBtn
                  onFieldDeleted={() => onFieldDeleted(currIndex)}
                />
              </View>
            )}
          </View>
        );
      })}

      {(((!maxCount || count < maxCount) && addButton) || count === 0) && (
        <AddBtn />
      )}
    </View>
  );
};

MultiLinkField.propTypes = {
  validation: shape({
    formStore: object,
    name: string,
    validateRule: oneOfType([string, object]),
  }),
  placeholderValueText: string,
  multiline: bool,
  addMultiFieldBtnName: string,
  maxLength: number,
  label: string,
  title: string,
  maxCount: number,
  link: bool,
  rule: bool,
  onFieldDeleted: func,
  currRules: shape({
    title: string,
    value: string,
  }),
  onChangeText: func,
};

RemoveLinkBtn.propTypes = {
  onFieldDeleted: func,
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

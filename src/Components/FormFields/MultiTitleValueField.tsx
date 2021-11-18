import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import {text, layout, colors, sizeL} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {LINK_VALIDATION_RULES} from '~/Stores/FormStores/ValidationRules/linkRules';
import {FormStoreValidation} from '~/Stores/FormStores';

const RemoveLinkBtn: React.FC<{
  onPress(): void;
}> = ({onPress}) => (
  <TouchableOpacity style={styles.removeBtnContainer} onPress={() => onPress()}>
    <Icon name="delete" size={16} />
  </TouchableOpacity>
);

const MultiTitleValueField: React.FC<{
  validation: FormStoreValidation;
  value: any;
  allowsEditing: boolean;
  placeholderValueText: string;
  multiline: boolean;
  addMultiFieldBtnName: string;
  maxLength: number;
  maxLengthDescription: number;
  label: string;
  title: string;
  maxCount: number;
  link: boolean;
  rule: boolean;
  onFieldDeleted(index: number): void;
  currRules: any[];
  onChangeText(text: string): void;
}> = (props) => {
  const {
    maxCount,
    validation,
    placeholderValueText,
    multiline,
    addMultiFieldBtnName,
    maxLength,
    maxLengthDescription,
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

  const onFieldDeleted = React.useCallback((currIndex: number) => {
    setCount(count - 1);
    if (props.validation) {
      props.validation.formStore.removeFormField(
        props.validation.name,
        currIndex,
      );
    }
    props.onFieldDeleted && props.onFieldDeleted(currIndex);
  }, []);

  const onChangeText = (
    value: string,
    currTitleItemValidation: FormStoreValidation,
  ) => {
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
        currTitleItemValidation.validateRule as string,
        true,
      );
    }
    props.onChangeText && props.onChangeText(value);
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
        const currItemValidation: FormStoreValidation = {
          ...props.validation,
          name: `${currIndex}_value`,
          multiName: props.validation.name,
          validateRule:
            validation?.validateRule?.value ||
            LINK_VALIDATION_RULES.LINKS ||
            validation.validateRule,
          invisibleContainer: true,
          immediateValidation: true,
          customErrorMessage: `${
            link ? 'Link format is invalid' : 'Rule description is required'
          }`,
        };

        const currTitleItemValidation: FormStoreValidation = {
          ...props.validation,
          name: `${currIndex}_title`,
          multiName: props.validation.name,
          validateRule:
            (typeof validation?.validateRule === 'object' &&
              'title' in validation.validateRule &&
              (validation.validateRule.title as string)) ||
            'string',
          topPosition: true,
          invisibleContainer: true,
          immediateValidation: true,
          customErrorMessage: `${link ? 'Link' : 'Rule'} title is required`,
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
              maxLength={maxLengthDescription}
              multiline={multiline}
              validation={currItemValidation}
            />
            {count > currIndex && (
              <View style={styles.removeBtn}>
                <RemoveLinkBtn onPress={() => onFieldDeleted(currIndex)} />
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
    top: 8,
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

export default MultiTitleValueField;

import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import {text, layout, colors, sizeL} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {string, bool, object, number, shape, oneOfType, func} from 'prop-types';

const RemoveLinkBtn = ({onFieldDeleted}) => (
  <TouchableOpacity
    style={styles.removeBtnContainer}
    onPress={() => onFieldDeleted()}>
    <Icon name="delete" size={16}/>
  </TouchableOpacity>
);

const MultiLinkField = (props) => {
  const [ count, setCount ] = useState(1);
  const [ addButton, setAddButton ] = useState(false);
  const [ deletedFields, setDeletedFields ] = useState([]);

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

  const onFieldDeleted = (currIndex, currTitleItemValidation, currItemValidation) => {
    if (currTitleItemValidation && currItemValidation) {
      currTitleItemValidation.formStore.removeFormField(currTitleItemValidation.name);
      currItemValidation.formStore.removeFormField(currItemValidation.name);
    }
    setCount(count - 1);
    setDeletedFields([ ...deletedFields, currIndex ]);
  };

  const onChangeText = (value, currTitleItemValidation) => {
    if (value.length > 0) {
      canAddMore();
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule + '|required');
    } else {
      setAddButton(false);
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule);
    }
  };

  const AddBtn = ({}) => (
    <TouchableOpacity>
      <Text style={styles.addLinkBtn} onPress={() => {
        setCount(count + 1);
        canAddMore();
      }}>
        {addMultiFieldBtnName ||
          (link
            ? 'Add Link'
            : rule
              ? 'Add rule'
              : 'Add field')
        }
      </Text>
    </TouchableOpacity>);

  const canAddMore = () => {
    let canAdd = true;
    [ ...Array(count).keys() ].forEach((i) => {
      let {error, value} = validation?.formStore?.form?.fields[`${validation.name}_value_${i + 1}`];
      if (!value || typeof error === 'string') {
        canAdd = false;
      }
    });

    setAddButton(canAdd);
  };

  return (
    <View style={{paddingTop: sizeL}}>
      {[ ...Array(count).keys() ].map((currIndex) => {
        const currItemValidation = {
          ...props.validation,
          name: `${props.validation.name}_value_${currIndex + 1}`,
          multiName: props.validation.name,
          validateRule: validation.validateRule?.common || validation.validateRule,
          invisibleContainer: true,
        }; //{...validation};

        const currTitleItemValidation = {
          ...props.validation,
          name: `${props.validation.name}_title_${currIndex + 1}`,
          multiName: props.validation.name,
          validateRule: validation.validateRule?.title || 'string',
          topPosition: true,
          invisibleContainer: true,
        }; //{...validation};

        return (
          <View key={`key_${props.validation.name}_${currIndex + 1}`}style={layout.marginBottomM}>
            {props.title && (
              <TextInputField
                label={props.label}
                onChangeText={(value) => {
                  canAddMore();
                  onChangeText(value, currItemValidation);
                }}
                viewStyle={{marginTop: 0}}
                placeholderText={props.title}
                validation={currTitleItemValidation}
                maxLength={maxLength}
              />
            )}

            <TextInputField
              value={''}
              onChangeText={(value) => {
                onChangeText(value, currTitleItemValidation);
              }}
              viewStyle={{marginTop: -5}}
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
            {count > currIndex  && <View style={styles.removeBtn}>
              <RemoveLinkBtn onFieldDeleted={() => onFieldDeleted(currIndex, currTitleItemValidation, currItemValidation)} />
            </View>}
          </View>
        );
      })}

      {
        ((!maxCount || (count - deletedFields.length) < maxCount) && addButton || count === 0) && (
          <AddBtn />
        )
      }
    </View>
  );
};

MultiLinkField.propTypes = {
  validation: shape({
    formStore: object,
    name: string,
    validateRule: oneOfType([
      string,
      object,
    ]),
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

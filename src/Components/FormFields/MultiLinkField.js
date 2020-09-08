import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import {text, layout, colors, sizeL} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {string, bool, object, number, shape} from 'prop-types';

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
  } = props;

  const onFieldDeleted = (currIndex, currTitleItemValidation, currItemValidation) => {
    revalidateAddBtn();

    if (currTitleItemValidation && currItemValidation) {
      currTitleItemValidation.formStore.removeFormField(currTitleItemValidation.name);
      currItemValidation.formStore.removeFormField(currItemValidation.name);
    }
    setCount(count - 1);
    setDeletedFields([ ...deletedFields, currIndex ]);
  };

  const revalidateAddBtn = () => {
    setAddButton(canAddMoreLinks());
  };

  const onChangeText = (value, currTitleItemValidation) => {
    if (value.length > 0) {
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule + '|required');
    } else {
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule);
    }

  };

  const AddLinkBtn = ({addMultiFieldBtnName, setCount}) => (
    <TouchableOpacity>
      <Text style={styles.addLinkBtn} onPress={() => {
        setCount();
        revalidateAddBtn();
      }}>
        {addMultiFieldBtnName || 'Add Link'}
      </Text>
    </TouchableOpacity>
  );

  const RemoveLinkBtn = ({onDeletedField}) => (
    <TouchableOpacity
      style={styles.removeBtnContainer}
      onPress={() => onDeletedField()}>
      <Icon name="delete" size={16}/>
    </TouchableOpacity>
  );

  const canAddMoreLinks = () => {
    let canAdd = true;

    [ ...Array(count).keys() ].forEach((i) => {
      if (
        validation.formStore.form.fields[`${props.validation.name}_title_${i + 1}`]?.error ||
        !validation.formStore.form.fields[`${props.validation.name}_title_${i + 1}`]?.value ||
        validation.formStore.form.fields[`${props.validation.name}_title_${i + 1}`]?.value === ''
      ) {
        canAdd = false;
      }

      if (
        validation.formStore.form.fields[`${props.validation.name}_value_${i + 1}`]?.error ||
        !validation.formStore.form.fields[`${props.validation.name}_value_${i + 1}`]?.value ||
        validation.formStore.form.fields[`${props.validation.name}_value_${i + 1}`]?.value === ''
      ) {
        canAdd = false;
      }
    });

    return canAdd;
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

        const {formStore} = validation;

        return (
          !deletedFields.includes(currIndex) && (
            <View key={`key_${props.validation.name}_${currIndex + 1}`} style={layout.marginBottomM}>
              {props.title && (
                <TextInputField
                  label={props.label}
                  onChangeText={revalidateAddBtn}
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
                  revalidateAddBtn();
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
            {count > currIndex  && <View style={styles.removeBtn}>
              <RemoveLinkBtn onDeletedField={() => onFieldDeleted(currIndex, currTitleItemValidation, currItemValidation)} />
            </View>}
          </View>
        );
      })}

      {
        ((!maxCount || (count - deletedFields.length) < maxCount) && addButton) && (
          <AddLinkBtn setCount={() => setCount(count + 1)}/>
        )
      }
    </View>
  );
};

MultiLinkField.propTypes = {
  validation: shape({
    formStore: object,
    name: string,
    validateRule: string,
  }),
  placeholderValueText: string,
  multiline: bool,
  addMultiFieldBtnName: string,
  maxLength: number,
  label: string,
  title: string,
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

import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import {text, layout, colors, sizeL} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {string, bool, object, number, shape, func} from 'prop-types';

const RemoveLinkBtn = ({onDeletedField}) => (
  <TouchableOpacity
    style={styles.removeBtnContainer}
    onPress={() => onDeletedField()}>
    <Icon name="delete" size={16}/>
  </TouchableOpacity>
);


const AddLinkBtn = ({handleAddLink, addMultiFieldBtnName}) => (
  <TouchableOpacity>
    <Text style={styles.addLinkBtn} onPress={() => handleAddLink()}>
      {addMultiFieldBtnName || 'Add Link'}
    </Text>
  </TouchableOpacity>
);

const MultiLinkField = ({validation,
  placeholderValueText,
  multiline,
  addMultiFieldBtnName,
  maxLength,
  title,
  label}) => {

  const [ count, setCount ] = useState(1);
  const [ deletedFields, setDeletedFields ] = useState([]);
  const [ addMoreLinks, setAddMoreLinks] = useState(false);

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
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule + '|required');
      canAddMoreLinks();
    } else {
      validation.formStore.updateFieldValidationRule(currTitleItemValidation.name, currTitleItemValidation.validateRule);
      setAddMoreLinks(false);
    }
  };

  const canAddMoreLinks = () => {
    let addMore = true;
    [ ...Array(count).keys() ].forEach((i) => {
      let {error, value} = validation.formStore.form.fields[`${validation.name}_value_${i + 1}`];
      if (!value || typeof error === 'string') {
        addMore = false;
      }
    });
    setAddMoreLinks(addMore);
  };

  const handleAddLink = () => {
    setCount(count + 1);
    setAddMoreLinks(false);
  };


  return (
    <View style={{paddingTop: sizeL}}>
      {[ ...Array(count).keys() ].map((currIndex) => {

        const currItemValidation = {
          ...validation,
          name: `${validation.name}_value_${currIndex + 1}`,
          multiName: validation.name,
          validateRule: validation.validateRule?.common || validation.validateRule,
          invisibleContainer: true,
        };

        const currTitleItemValidation = {
          ...validation,
          name: `${validation.name}_title_${currIndex + 1}`,
          multiName: validation.name,
          validateRule: validation.validateRule?.title || 'string',
          topPosition: true,
          invisibleContainer: true,
        };

        return <View key={`key_${validation.name}_${currIndex + 1}`} style={layout.marginBottomM}>
          {title && (
            <TextInputField
              label={label}
              viewStyle={{marginTop: 0}}
              placeholderText={title}
              validation={currTitleItemValidation}
              maxLength={maxLength}
            />
          )}

          <TextInputField
            value={''}
            onChangeText={(value) => onChangeText(value, currTitleItemValidation)}
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
            onSubmit={() => canAddMoreLinks()}
          />

          {count > currIndex  && <View style={styles.removeBtn}>
            <RemoveLinkBtn onDeletedField={() => onFieldDeleted(currIndex, currTitleItemValidation, currItemValidation)} />
          </View>}

        </View>;
      })}
      {(addMoreLinks || count === 0)  && <AddLinkBtn  handleAddLink={handleAddLink} />}
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

RemoveLinkBtn.propTypes = {
  onDeletedField: func,
};

AddLinkBtn.propTypes = {
  handleAddLink: func,
  addMultiFieldBtnName: string,
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
  addLinkBtn: {
    ...text.h3Black,
    color: colors.mainBlue,
    textAlign: 'left',
    fontSize: 16,
  },
});

export default MultiLinkField;

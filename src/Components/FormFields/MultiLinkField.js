import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import {text, layout, colors, font, sizeL} from '../../Theme';

const MultiLinkField = props => {
  const [count, setCount] = useState(1);
  const {
    maxCount,
    validation,
    placeholderValueText,
    multiline,
    addMultiFieldBtnName,
  } = props;

  // let fieldName = null;

  useEffect(() => {
    // fieldName = validation.name;
  }, []);

  const renderAddLinkBtn = index => {
    if (index === count - 1 && (!maxCount || count < maxCount)) {
      return (
        <TouchableOpacity>
          <Text style={styles.addLinkBtn} onPress={() => setCount(count + 1)}>
            {addMultiFieldBtnName ? addMultiFieldBtnName : 'Add Link'}
          </Text>
        </TouchableOpacity>
      );
    }
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

        const currTitleItemValidation = {...props.validation}; //{...validation};
        currTitleItemValidation.name = `${
          props.validation.name
        }_title_${currIndex + 1}`;
        currTitleItemValidation.multiName = props.validation.name;
        currTitleItemValidation.validateRule =
          validation.validateRule?.title || 'string';
        currTitleItemValidation.topPosition = true;

        return (
          <View key={`key_${props.validation.name}_${currIndex + 1}`}>
            {props.title ? (
              <TextInputField
                innerLabel={maxCount ? `${currIndex + 1}/${maxCount}` : false}
                placeholderText={props.title}
                validation={currTitleItemValidation}
              />
            ) : null}
            <TextInputField
              value={''}
              viewStyle={{marginTop: 0}}
              placeholderText={
                placeholderValueText ? placeholderValueText : 'https://'
              }
              autoCapitalize="none"
              autoCorrect={false}
              multiline={multiline}
              validation={currItemValidation}
            />
            {renderAddLinkBtn(currIndex)}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
});

export default MultiLinkField;
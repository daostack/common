import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import {text, layout, colors, sizeL} from '../../Theme';

const MultiLinkField = props => {
  const [count, setCount] = useState(1);

  const {maxCount, validation, placeholderValueText, multiline} = props;

  const renderAddLinkBtn = index => {
    if (index === count - 1 && (!maxCount || count < maxCount)) {
      return (
        <TouchableOpacity>
          <Text style={styles.addLinkBtn} onPress={() => setCount(count + 1)}>
            Add Link
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={{paddingTop: sizeL}}>
      {[...Array(count).keys()].map(currIndex => {
        const currItemValidation = {...validation};
        currItemValidation.name = `${currItemValidation.name}_value_${currIndex}`;

        const currTitleItemValidation = {...validation};
        currTitleItemValidation.name = `${currItemValidation.name}_title_${currIndex}`;
        currTitleItemValidation.validateRule = 'string';
        currTitleItemValidation.topPosition = true;

        return (
          <View key={`key_${currItemValidation.name}_${currIndex}`}>
            {props.title ? (
              <TextInputField
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

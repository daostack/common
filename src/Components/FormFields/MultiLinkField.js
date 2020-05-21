import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import {text, layout, colors, sizeL} from '../../Theme';

const MultiLinkField = props => {
  const [count, setCount] = useState(1);

  const {maxCount, validation} = props;

  const isValid = () => {
    const links = [...Array(count).keys()].map(
      x => `key_${currItemValidation.name}_${currIndex}`,
    );
    const result = validation.formStore.isFormValidSelectedFields([...links]);
    setPass(result);
    return result;
  };

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
        currItemValidation.name = `${currItemValidation.name}_${currIndex}`;

        return (
          <View key={`key_${currItemValidation.name}_${currIndex}`}>
            {props.title ? (
              <TextInputField placeholderText={props.title} />
            ) : null}
            <TextInputField
              value={''}
              viewStyle={{marginTop: 0}}
              placeholderText="https://"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={isValid}
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

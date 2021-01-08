import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import FileField from './FileField';
import {sizeM} from '~/Theme';
import {string, number, shape, object} from 'prop-types';

const MultiFileField = (props) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const currFormField = props.validation.formStore.getFormField(
      props.validation.name,
    );
    if (currFormField) {
      setCount(Object.keys(currFormField)?.length);
    }
  }, []);

  const onChangeFile = (fileName, index) => {
    if (!maxCount || count < maxCount) {
      setCount(count + 1);
    }
  };

  const onFieldDeleted = (currIndex) => {
    setCount(count - 1);
    if (props.validation) {
      props.validation.formStore.removeFormField(
        props.validation.name,
        currIndex,
      );
    }
  };

  const {maxCount, navigation} = props;

  return (
    <View style={{paddingTop: sizeM}}>
      {[...Array(count).keys()].map((currIndex) => {
        const currItemValidation = {...props.validation};
        currItemValidation.name = `${currIndex}`;
        currItemValidation.multiName = props.validation.name;

        return (
          <FileField
            key={`key_${currItemValidation.name}_${currIndex}`}
            onChangeFile={(fileName) => onChangeFile(fileName, currIndex)}
            onFieldDeleted={() => onFieldDeleted(currIndex)}
            allowsEditing={true}
            title={'Add File'}
            value={
              currItemValidation.formStore.getFormField(
                currItemValidation.name,
                currItemValidation.multiName,
              )?.value
            }
            validation={currItemValidation}
            navigation={navigation}
          />
        );
      })}
    </View>
  );
};

MultiFileField.propTypes = {
  maxCount: number,
  navigation: object,
  validation: shape({
    name: string,
  }),
};

export default MultiFileField;

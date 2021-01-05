import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import ImageField from './ImageField';
import {sizeL} from '~/Theme';
import {string, bool, shape, number} from 'prop-types';

const MultiImageField = (props) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const currFormField = props.validation.formStore.getFormField(
      props.validation.name,
    );
    if (currFormField) {
      setCount(Object.keys(currFormField)?.length);
    }
  }, []);

  const onChangeImage = (url, index) => {
    if (index === count - 1) {
      if (!maxCount || count < maxCount) {
        setCount(count + 1);
      }
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

  const {maxCount} = props;

  return (
    <View style={{paddingTop: sizeL}}>
      {[...Array(count).keys()].map((currIndex) => {
        const currItemValidation = {...props.validation};
        currItemValidation.name = `${currIndex}`;
        currItemValidation.multiName = props.validation.name;

        return (
          <ImageField
            key={`key_${currItemValidation.name}_${currIndex}`}
            onChangeImage={(url) => onChangeImage(url, currIndex)}
            allowsEditing={props.allowsEditing || false}
            onFieldDeleted={() => onFieldDeleted(currIndex)}
            title={'Add Image'}
            value={
              currItemValidation.formStore.getFormField(
                currItemValidation.name,
                currItemValidation.multiName,
              )?.value
            }
            validation={currItemValidation}
          />
        );
      })}
    </View>
  );
};

MultiImageField.propTypes = {
  maxCount: number,
  validation: shape({
    name: string,
  }),
  allowsEditing: bool,
};

export default MultiImageField;

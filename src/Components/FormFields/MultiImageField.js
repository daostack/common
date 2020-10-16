import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import ImageField from './ImageField';
import {sizeL} from '~/Theme';
import {string, bool, shape, number} from 'prop-types';

const MultiImageField = (props) => {
  const [count, setCount] = useState(1);
  const [deletedFields, setDeletedFields] = useState([]);

  useEffect(() => {
    const currFormField = props.validation.formStore.getFormField(props.validation.name);
    if (currFormField) {
      setCount(currFormField?.length);
    }
  }, []);

  const onChangeImage = (url, index) => {
    if (index === (count - deletedFields.length) - 1) {
      if (!maxCount || (count - deletedFields.length) < maxCount) {
        setCount(count + 1);
      }
    }
  };

  const onFieldDeleted = (currIndex) => {
    setDeletedFields([...deletedFields, currIndex]);
  };

  const {maxCount} = props;

  return (
    <View style={{paddingTop: sizeL}}>
      {[...Array(count).keys()].map((currIndex) => {
        const currItemValidation = {...props.validation};
        currItemValidation.name = `${currIndex}`;
        currItemValidation.multiName = props.validation.name;

        return (
          !deletedFields.includes(currIndex) && <ImageField
            key={`key_${currItemValidation.name}_${currIndex}`}
            onChangeImage={(url) => onChangeImage(url, currIndex)}
            allowsEditing={props.allowsEditing || false}
            onFieldDeleted={() => onFieldDeleted(currIndex)}
            title={'Add Image'}
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

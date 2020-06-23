import React, {useState} from 'react';
import {View} from 'react-native';
import ImageField from './ImageField';
import {sizeL} from '../../Theme';

const MultiImageField = props => {
  const [count, setCount] = useState(1);
  const [deletedFields, setDeletedFields] = useState([]);

  const onChangeImage = (url, index) => {
    if (index === count - 1) {
      if (!maxCount || count < maxCount) {
        setCount(count + 1);
      }
    }
  };

  const onFieldDeleted = (currIndex) => {
    setDeletedFields([...deletedFields, currIndex]);
  };

  const {maxCount, validation} = props;

  return (
    <View style={{paddingTop: sizeL}}>
      {[...Array(count).keys()].map(currIndex => {
        const currItemValidation = {...props.validation};
        currItemValidation.name = `${currItemValidation.name}_multi_${currIndex}`;
        currItemValidation.multiName = props.validation.name;

        return (
          !deletedFields.includes(currIndex) && <ImageField
            key={`key_${currItemValidation.name}_${currIndex}`}
            onChangeImage={url => onChangeImage(url, currIndex)}
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

export default MultiImageField;

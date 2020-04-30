import React, {useState} from 'react';
import {View} from 'react-native';
import ImageField from './ImageField';
import {text, layout, colors, sizeL} from '../../Theme';

const MultiFileField = props => {
  const [count, setCount] = useState(1);

  const onChangeImage = (url, index) => {
    if (index == count - 1) {
      if (!maxCount || count < maxCount) {
        setCount(count + 1);
      }
    }
  };

  const {maxCount, validation} = props;

  return (
    <View style={{paddingTop: sizeL}}>
      {[...Array(count).keys()].map(currIndex => {
        const currItemValidation = {...validation};
        currItemValidation.name = `${currItemValidation.name}_${currIndex}`;

        return (
          <ImageField
            key={`key_${currItemValidation.name}_${currIndex}`}
            onChangeImage={url => onChangeImage(url, currIndex)}
            allowsEditing={true}
            title={'Add Imagee'}
            validation={currItemValidation}
          />
        );
      })}
    </View>
  );
};

export default MultiFileField;

import React, {useState} from 'react';
import {View} from 'react-native';
import FileField from './FileField';
import {sizeL} from '../../Theme';

const MultiFileField = props => {
  const [count, setCount] = useState(1);

  const onChangeFile = (fileName, index) => {
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
          <FileField
            key={`key_${currItemValidation.name}_${currIndex}`}
            onChangeFile={fileName => onChangeFile(fileName, currIndex)}
            allowsEditing={true}
            title={'Add File'}
            validation={currItemValidation}
          />
        );
      })}
    </View>
  );
};

export default MultiFileField;

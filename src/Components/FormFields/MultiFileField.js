import React, {useState} from 'react';
import {View} from 'react-native';
import FileField from './FileField';
import {sizeL} from '../../Theme';

const MultiFileField = props => {
  const [count, setCount] = useState(1);
  const [deletedFields, setDeletedFields] = useState([]);

  const onChangeFile = (fileName, index) => {
    if (index === (count - deletedFields.length) - 1) {
      if (!maxCount || (count - deletedFields.length) < maxCount) {
        setCount(count + 1);
      }
    }
  };

  const onFieldDeleted = (currIndex) => {
    setDeletedFields([...deletedFields, currIndex]);
  };


  const { maxCount, validation, navigation } = props;

  return (
    <View style={{paddingTop: sizeL}}>
      {[...Array(count).keys()].map(currIndex => {
        const currItemValidation = { ...props.validation };
        currItemValidation.name = `${currItemValidation.name}_multi_${currIndex}`;
        currItemValidation.multiName = props.validation.name;

        return (
          !deletedFields.includes(currIndex) && <FileField
            key={`key_${currItemValidation.name}_${currIndex}`}
            onChangeFile={fileName => onChangeFile(fileName, currIndex)}
            onFieldDeleted={() => onFieldDeleted(currIndex)}
            allowsEditing={true}
            title={'Add File'}
            validation={currItemValidation}
            navigation={navigation}
          />
        );
      })}
    </View>
  );
};

export default MultiFileField;

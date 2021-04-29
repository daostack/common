import React, {FC, useCallback} from 'react';
import Intercom from 'react-native-intercom';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

const IntercomShowButton: FC = () => {
  const handlePress = useCallback(() => {
    Intercom.displayMessageComposer();
  }, []);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.button} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 20,
    height: 20,
    marginRight: 10,
    backgroundColor: 'red',
  },
});

export default IntercomShowButton;

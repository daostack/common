import React, {FC, useCallback} from 'react';
import Intercom from 'react-native-intercom';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';

const IntercomShowButton: FC = () => {
  const handlePress = useCallback(() => {
    Intercom.displayMessageComposer();
  }, []);

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Icon name={'lifebuoy-32'} size={32} color={colors.shadowColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 28,
    height: 28,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IntercomShowButton;

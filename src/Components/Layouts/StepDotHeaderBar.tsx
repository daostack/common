import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import IntercomShowButton from '~/Components/IntercomChat/IntercomShowButton';
import {colors, text} from '~/Theme';
import {STEP_HEADER_BAR_HEIGHT} from '~/Util/constants/header';

interface StepDotHeaderBarProps {
  closeDialog: () => void;
  onLeftPress: () => void;
  title: string;
}

export const StepDotHeaderBar = (props: StepDotHeaderBarProps) => {
  const {closeDialog, onLeftPress, title} = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.leftButton} onPress={onLeftPress}>
        <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
      </TouchableOpacity>
      <View style={styles.rightContainer}>
        <IntercomShowButton />
        <TouchableOpacity onPress={closeDialog}>
          <Icon
            name="close"
            size={18}
            style={{marginRight: 20}}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: STEP_HEADER_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  title: {
    ...text.h2Black,
    maxWidth: '70%',
    alignSelf: 'center',
  },
  leftButton: {
    position: 'absolute',
    left: 0,
  },
  rightContainer: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

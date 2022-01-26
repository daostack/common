import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {text} from '~/Theme';

interface HeaderProps {
  title: string;
  onPress: () => void;
}

export const Header = (props: HeaderProps) => {
  const {title, onPress} = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.leftButton}
        onPress={onPress}>
        <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
      </TouchableOpacity>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 60,
  },
  leftButton: {
    position: 'absolute',
    left: 0,
  },
  text: {
    ...text.h2Black,
    maxWidth: '70%',
    alignSelf: 'center',
  },
});

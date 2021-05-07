import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, text} from '~/Theme';
import {func, string, oneOfType, bool} from 'prop-types';

type Props = {
  title: string;
  onPress?: () => void;
  canEdit: string;
};

const Title: FC<Props> = ({title, onPress, canEdit}) => {
  const handlePress = () => {
    onPress && onPress();
  };

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{title}</Text>
      {canEdit && (
        <TouchableOpacity style={styles.editText} onPress={handlePress}>
          <Icon
            style={{marginTop: 2}}
            size={16}
            name="edit-16"
            color={colors.black}
          />
          <Text style={{...text.h3Black, marginLeft: 5}}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleText: {
    ...text.h2Black,
    paddingVertical: 7,
  },
  editText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 7,
  },
});

Title.propTypes = {
  title: string.isRequired,
  onPress: func,
  canEdit: oneOfType([string, bool]) ,
};

export default Title;

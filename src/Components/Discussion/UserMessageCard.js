import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import React from 'react';

import Icon from '../../Assets/iconfont/Icon';
import {layout, colors, text} from '../../Theme';

const UserMessageCard = ({photoURL, name, message, time}) => {
  console.log('photoURL -> ', photoURL);
  return (
    <View style={styles.messageCardContainer}>
      <Image style={styles.userImage} source={{uri: photoURL}} />
      <View style={styles.messageContainer}>
        <Text style={styles.nameStyle}>{name}</Text>
        <Text style={styles.messageStyle}>{message}</Text>
        <Text style={styles.timeStyle}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
    marginRight: 20,
  },
  messageCardContainer: {
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    padding: 0,
    marginBottom: 20,
  },
  messageContainer: {
    ...layout.content,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: colors.grey4,
    ...layout.flexStart,
  },
  nameStyle: {
    ...text.h3Black,
    textAlign: 'left',
  },
  messageStyle: {...text.blackText, ...layout.marginTopS},
  timeStyle: {
    ...text.textFieldplaceholder,
    textAlign: 'right',
    width: '100%',
  },
});

export default UserMessageCard;

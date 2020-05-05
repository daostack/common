import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';

import React from 'react';
import {text, layout, colors} from '../Theme';
import SwipeButton from 'rn-swipe-button';

const ButtonSwiper = ({navigation, onSwipeSuccess, title}) => {
  const showToastMessage = msg => {
    console.log('MSG -> ', msg);
  };

  const thumbComponent = () => <View style={styles.swiperThumbIcon}></View>;

  return (
    <View style={{...layout.marginTopXL, ...{height: 100}}}>
      <SwipeButton
        width={340}
        height={60}
        title={title}
        titleStyles={text.smallGreyText}
        railFillBackgroundColor="rgba(0, 0, 0, 0.1)"
        railFillBorderColor="trarnsparent"
        thumbIconBorderColor={colors.grey4}
        thumbIconComponent={thumbComponent}
        railBackgroundColor={colors.grey4}
        railBorderColor={colors.grey4}
        onSwipeStart={() => showToastMessage('Swipe started!')}
        onSwipeFail={() => showToastMessage('Incomplete swipe!')}
        onSwipeSuccess={onSwipeSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  swiperThumbIcon: {
    width: 70,
    height: 70,

    backgroundColor: colors.white,

    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 34,
    shadowOpacity: 1,
  },
});

export default ButtonSwiper;

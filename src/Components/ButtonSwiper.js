import React from 'react';
import {View, StyleSheet} from 'react-native';
import SwipeButton from 'rn-swipe-button';
import {text, layout, colors} from '~/Theme';
import {string, func} from 'prop-types';

const ButtonSwiper = ({onSwipeSuccess, title}) => {
  const thumbComponent = () => <View style={styles.swiperThumbIcon} />;

  return (
    <View style={{...layout.marginTopS, ...{height: 100}}}>
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
        onSwipeSuccess={onSwipeSuccess}
      />
    </View>
  );
};

ButtonSwiper.propTypes = {
  onSwipeSuccess: func,
  title: string,
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
    elevation: 4,
  },
});

export default ButtonSwiper;

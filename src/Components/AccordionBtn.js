import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {text, font,layout, colors} from 'common/src/Theme';
import Icon from '~/Assets/iconfont/Icon';
import React from 'react';
import {string, func, bool} from 'prop-types';


const BtnContent = ({lightStyle, title, subtitle}) => (
  <>
  <View>
    <Text style={lightStyle
      ? {...styles.btnText, ...styles.btnTextLight}
      : {...styles.btnText}}>{title}
    </Text>
    {subtitle && <Text style={styles.btnSubtitleText}>{subtitle}</Text>}
  </View>
  {!lightStyle && <Icon name="right-arrow" />}
  </>
);

const AccordionBtn = ({title, subtitle, onPress, lightStyle}) => (
  <TouchableOpacity
    onPress={onPress}
    style={
      lightStyle
        ? {...styles.accordionBtn, ...styles.accordionBtnLight}
        : styles.accordionBtn
    }>
    <BtnContent {...{lightStyle, title, subtitle}} />
  </TouchableOpacity>
);

AccordionBtn.propTypes = {
  title: string.isRequired,
  subtitle: string,
  onPress: func.isRequired,
  lightStyle: bool,
};

const styles = StyleSheet.create({
  accordionBtn: {
    ...layout.content,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    height: 60,
    paddingVertical: 0,

  },
  accordionBtnLight: {
    borderBottomWidth: 0,
  },
  btnText: {
    ...font.primary.semiBold,
    ...font.fontSize(3),
    lineHeight: 20,
  },
  btnTextLight: {
    ...font.primary.semiBold,
    ...font.fontSize(3),
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.grey3,
  },
  btnSubtitleText: {
    ...text.bvBmseYstWetqTFn5Au,
    marginTop: 5,
  },
});

export default AccordionBtn;

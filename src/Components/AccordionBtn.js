import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import React from 'react';
import { string, func, any } from 'prop-types';
import {
  text, font, layout, colors,
} from '../Theme';
import Icon from '../Assets/iconfont/Icon';

const AccordionBtn = ({
  title, subtitle, onPress, lightStyle,
}) => {
  const renderBtnTitle = () => {
    let btnTitleStyle = { ...styles.btnText };
    if (lightStyle) {
      btnTitleStyle = { ...styles.btnText, ...styles.btnTextLight };
    }

    return <Text style={btnTitleStyle}>{title}</Text>;
  };

  const renderArrow = () => {
    if (!lightStyle) {
      return <Icon name="right-arrow" />;
    }
  };

  const renderBtnContent = () => {
    if (subtitle) {
      return (
        <>
          <View>
            {renderBtnTitle()}
            <Text style={styles.btnSubtitleText}>{subtitle}</Text>
          </View>
          {renderArrow()}
        </>
      );
    }
    return (
      <>
        {renderBtnTitle()}
        {renderArrow()}
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        lightStyle
          ? { ...styles.accordionBtn, ...styles.accordionBtnLight }
          : styles.accordionBtn
      }
    >
      {renderBtnContent()}
    </TouchableOpacity>
  );
};

AccordionBtn.propTypes = {
  title: string.isRequired,
  subtitle: string.isRequired,
  onPress: func.isRequired,
  lightStyle: any,
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

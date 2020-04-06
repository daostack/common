import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {text, layout, colors} from '../Theme';
import Icon from '../Assets/iconfont/Icon';
import React from 'react';

const AccordionBtn = ({title, subtitle, onPress, lightStyle}) => {
  const renderBtnTitle = () => {
    let btnTitleStyle = {...styles.btnText};
    if (lightStyle) {
      btnTitleStyle = {...styles.btnText, ...styles.btnTextLight};
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
    } else {
      return (
        <>
          {renderBtnTitle()}
          {renderArrow()}
        </>
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        lightStyle
          ? {...styles.accordionBtn, ...styles.accordionBtnLight}
          : styles.accordionBtn
      }>
      {renderBtnContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  accordionBtn: {
    ...layout.content,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    paddingVertical: 0,
    height: 56,
  },
  accordionBtnLight: {
    borderBottomWidth: 0,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
  },
  btnTextLight: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
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

import React, {ReactElement} from 'react';
import {View, StyleSheet, FlexAlignType} from 'react-native';

import {colors} from '~/Theme';
import {
  POSITION_ARROW,
  POSITION_ARROW_TOP,
} from '~/Util/constants/positionArrow.enum';

const alignSelf = (position: string): FlexAlignType => {
  switch (position) {
    case POSITION_ARROW.BOTTOM_LEFT:
      return 'flex-start';
    case POSITION_ARROW.TOP_LEFT:
      return 'flex-start';
    case POSITION_ARROW.BOTTOM_CENTER:
      return 'center';
    case POSITION_ARROW.TOP_CENTER:
      return 'center';
    case POSITION_ARROW.BOTTOM_RIGHT:
      return 'flex-end';
    case POSITION_ARROW.TOP_RIGHT:
      return 'flex-end';
    default:
      return 'center';
  }
};

interface Props {
  positionArrow: POSITION_ARROW;
  arrowMarginLeft?: number;
  arrowMarginRight?: number;
}

const Arrow = ({
  positionArrow,
  arrowMarginLeft,
  arrowMarginRight,
}: Props): ReactElement => (
  <View
    style={{
      ...styles.arrow,
      ...(POSITION_ARROW_TOP.includes(positionArrow)
        ? styles.arrowTop
        : styles.arrowBottom),
      marginLeft: arrowMarginLeft ? arrowMarginLeft : 0,
      marginRight: arrowMarginRight ? arrowMarginRight : 0,
      alignSelf: alignSelf(positionArrow),
    }}
  />
);

const styles = StyleSheet.create({
  arrow: {
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arrowBottom: {
    borderTopWidth: 13,
    borderTopColor: colors.mainBlue,
    borderBottomColor: 'transparent',
  },
  arrowTop: {
    borderBottomWidth: 13,
    borderTopColor: 'transparent',
    borderBottomColor: colors.mainBlue,
  },
});

export default Arrow;

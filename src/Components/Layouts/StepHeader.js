import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';
import * as Progress from 'react-native-progress';
import {bool, number, array} from 'prop-types';
const {width} = Dimensions.get('window');

const StepHeader = ({dotInfo, currentIndex, skipFirstDot = false}) => {
  const getDotProgress = (index) => {
    let dotsCount = dotInfo.length;
    if (skipFirstDot) {
      dotsCount = dotsCount - 1;
      index = index - 1;
    }

    // adding 0.1 for the dot width
    return +(index * (1 / dotsCount) + 0.1).toFixed(2);
  };

  const ovalStyle = (index) => {
    if (currentIndex > index) {
      return styles.ovalDone;
    }
    if (currentIndex === index) {
      return styles.oval;
    }
    if (currentIndex < index) {
      return styles.oval2;
    }
  };

  const iconColor = (index) => {
    if (currentIndex > index) {
      return colors.mainBlue;
    }
    if (currentIndex === index) {
      return colors.mainBlue;
    }
    if (currentIndex < index) {
      return colors.paleblue;
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
        paddingHorizontal: 30,
      }}>
      <Progress.Bar
        progress={getDotProgress(currentIndex)}
        width={width - 50 - 60}
        color={colors.mainBlue}
        borderWidth={0}
        unfilledColor={colors.grey4}
        style={{
          height: 2,
          position: 'absolute',
          marginHorizontal: 30,
        }}
      />

      {dotInfo.map((currDotInfo, dotIndex) => {
        if (skipFirstDot && dotIndex === 0) {
          return null;
        } else {
          return (
            <View key={dotIndex} style={ovalStyle(dotIndex)}>
              <Icon
                name={
                  currentIndex <= dotIndex ? currDotInfo.dotIconName : 'check'
                }
                size={currentIndex === dotIndex ? 24 : 16}
                color={iconColor(dotIndex)}
              />
            </View>
          );
        }
      })}
    </View>
  );
};

StepHeader.propTypes = {
  dotInfo: array,
  currentIndex: number,
  skipFirstDot: bool,
};

const styles = StyleSheet.create({
  oval: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF9FC',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.mainBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oval2: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovalDone: {
    width: 32,
    height: 32,
    borderRadius: 24,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.mainBlue,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF9FC',
  },
});

export default StepHeader;

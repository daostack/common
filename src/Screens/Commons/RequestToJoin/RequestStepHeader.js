import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';
import * as Progress from 'react-native-progress';
import {number, bool} from 'prop-types';
const {width} = Dimensions.get('window');

const RequestStepHeader = ({isFirstStepSkipped, currentIndex}) => {
  const deltaIndex = isFirstStepSkipped ? 1 : 0;
  const progressList = isFirstStepSkipped ?  [0, 0.35, 0.7, 1.0] : [0, 0.27, 0.54, 0.76, 1.0];

  currentIndex = currentIndex - deltaIndex;

  const ovalStyle = (index) => {
    if (currentIndex === index) {
      return styles.oval;
    }

    if (currentIndex > index) {
      return styles.ovalDone;
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
      }}
    >
      <Progress.Bar
        progress={progressList[currentIndex]} // 0 0.35 0.7 1.0
        width={width - 108}
        color={colors.mainBlue}
        borderWidth={0}
        unfilledColor={colors.grey4}
        style={{
          height: 2,
          position: 'absolute',
          marginHorizontal: 30,
        }}
      />

      {/* <TouchableOpacity onPress={() => setCurrentIndex(0)}> */}
      {!isFirstStepSkipped && (
        <View
          style={currentIndex === 0 ? {...styles.oval} : {...styles.ovalDone}}>
          <Icon
            name={currentIndex === 0 ? 'agenda-24' : 'check'}
            size={currentIndex > 0 ? 16 : 24}
          />
        </View>
      )}
      {/* </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => setCurrentIndex(1)}> */}
      <View style={ovalStyle(1 - deltaIndex)}>
        <Icon
          name={currentIndex < (2 - deltaIndex) ? 'account-selected' : 'check'}
          size={currentIndex === (1 - deltaIndex) ? 24 : 16}
          color={iconColor(1 - deltaIndex)}
        />
      </View>
      {/* </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => setCurrentIndex(2)}> */}
      <View style={ovalStyle(2 - deltaIndex)}>
        <Icon
          name={currentIndex < (3 - deltaIndex) ? 'contribution-24' : 'check'}
          size={currentIndex === (2 - deltaIndex) ? 24 : 16}
          color={iconColor(2 - deltaIndex)}
        />
      </View>
      {/* </TouchableOpacity>
      <TouchableOpacity onPress={() => setCurrentIndex(3)}> */}
      <View style={ovalStyle(3 - deltaIndex)}>
        <Icon
          name={currentIndex < (4 - deltaIndex) ? 'billing-details-24-copy-4' : 'check'}
          size={currentIndex === (3 - deltaIndex) ? 24 : 16}
          color={iconColor(3 - deltaIndex)}
        />
      </View>
      {/* </TouchableOpacity> */}

      <View style={ovalStyle(4 - deltaIndex)}>
        <Icon
          name={currentIndex < (5 - deltaIndex) ? 'wallet-24' : 'check'}
          size={currentIndex === (4 - deltaIndex) ? 24 : 16}
          color={iconColor(4 - deltaIndex)}
        />
      </View>
    </View>
  );
};

RequestStepHeader.propTypes = {
  isFirstStepSkipped: bool,
  currentIndex: number,
};

const styles = StyleSheet.create({
  oval: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
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
    backgroundColor: colors.lighterBlue,
  },
});

export default RequestStepHeader;

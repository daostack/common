import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Icon from '../../../Assets/iconfont/Icon';
import {colors} from '../../../Theme';
const {width} = Dimensions.get('window');
import * as Progress from 'react-native-progress';

const CreateStepHeader = props => {
  const currentIndex = props.currentIndex;
  const progressList = [0, 0.35, 0.7, 1.0];

  const ovalStyle = index => {
    if (props.currentIndex > index) {
      return styles.ovalDone;
    }
    if (props.currentIndex === index) {
      return styles.oval;
    }
    if (props.currentIndex < index) {
      return styles.oval2;
    }
  };

  const iconColor = index => {
    if (props.currentIndex > index) {
      return colors.mainBlue;
    }
    if (props.currentIndex === index) {
      return colors.mainBlue;
    }
    if (props.currentIndex < index) {
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
        progress={progressList[currentIndex]} // 0 0.35 0.7 1.0
        width={width - 48 - 60}
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
      <View
        style={currentIndex === 0 ? {...styles.oval} : {...styles.ovalDone}}>
        <Icon
          name={currentIndex === 0 ? 'dao-general-info-24' : 'check'}
          size={currentIndex > 0 ? 16 : 24}
        />
      </View>
      {/* </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => setCurrentIndex(1)}> */}
      <View style={ovalStyle(1)}>
        <Icon
          name={currentIndex < 2 ? 'funds' : 'check'}
          size={currentIndex === 1 ? 24 : 16}
          color={iconColor(1)}
        />
      </View>
      {/* </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => setCurrentIndex(2)}> */}
      <View style={ovalStyle(2)}>
        <Icon
          name={currentIndex < 3 ? 'agenda' : 'check'}
          size={currentIndex === 2 ? 24 : 16}
          color={iconColor(2)}
        />
      </View>
      {/* </TouchableOpacity>
      <TouchableOpacity onPress={() => setCurrentIndex(3)}> */}
      <View style={ovalStyle(3)}>
        <Icon
          name={currentIndex < 4 ? 'style' : 'check'}
          size={currentIndex === 3 ? 24 : 16}
          color={iconColor(3)}
        />
      </View>
      {/* </TouchableOpacity> */}
    </View>
  );
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
  iconBlue: {
    tintColor: colors.mainBlue,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  iconGrey: {
    tintColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
  },
  iconDone: {
    tintColor: colors.mainBlue,
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
  },
});

export default CreateStepHeader;

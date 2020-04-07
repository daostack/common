import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import {colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import * as Progress from 'react-native-progress';

const CreateStepHeader = (props) => {
  const currentIndex = props.currentIndex;
  const progressList = [0, 0.35, 0.7, 1.0];

  const ovalStyle = (index) => {
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

  const iconStyle = (index) => {
    if (props.currentIndex > index) {
      return styles.iconDone;
    }
    if (props.currentIndex === index) {
      return styles.iconBlue;
    }
    if (props.currentIndex < index) {
      return styles.iconGrey;
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
        <Image
          source={
            currentIndex === 0
              ? require('../../Assets/daoGeneralInfo.png')
              : require('../../Assets/checkmark.png')
          }
          style={currentIndex > 0 ? {...styles.iconDone} : {...styles.iconBlue}}
        />
      </View>
      {/* </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => setCurrentIndex(1)}> */}
      <View style={ovalStyle(1)}>
        <Image
          source={
            currentIndex <= 1
              ? require('../../Assets/funding.png')
              : require('../../Assets/checkmark.png')
          }
          style={iconStyle(1)}
        />
      </View>
      {/* </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => setCurrentIndex(2)}> */}
      <View style={ovalStyle(2)}>
        <Image
          source={
            currentIndex <= 2
              ? require('../../Assets/agenda.png')
              : require('../../Assets/checkmark.png')
          }
          style={iconStyle(2)}
        />
      </View>
      {/* </TouchableOpacity>
      <TouchableOpacity onPress={() => setCurrentIndex(3)}> */}
      <View style={ovalStyle(3)}>
        <Image
          source={
            currentIndex <= 3
              ? require('../../Assets/members24.png')
              : require('../../Assets/checkmark.png')
          }
          style={iconStyle(3)}
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

export default inject('createCommonFormStore')(observer(CreateStepHeader));

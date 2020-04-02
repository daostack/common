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
import * as Progress from 'react-native-progress';
import CreateStep1 from './CreateStep1';
import CreateStep2 from './CreateStep2';
import CreateStep3 from './CreateStep3';
import CreateStep4 from './CreateStep4';
const {width} = Dimensions.get('window');
import Swiper from 'react-native-swiper';

const CreateCommon = props => {
  const [common, setCommon] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiper = useRef(null);

  useEffect(() => {
    swiper.current.scrollBy(currentIndex);
  }, [currentIndex]);

  var progress = 0;
  const progressList = [0, 0.35, 0.7, 1.0];

  nextIndex = () => {
    setCurrentIndex(currentIndex + 1);
    console.log(currentIndex);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          padding: 24,
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            // padding: 32,
            marginBottom: 24,
          }}>
          <Progress.Bar
            progress={progressList[currentIndex]} // 0 0.35 0.7 1.0
            width={width - 48}
            color={colors.mainBlue}
            borderWidth={0}
            unfilledColor={colors.grey4}
            style={{height: 2, flex: 1, position: 'absolute'}}
          />
          <View style={ currentIndex === 0 ?  {...styles.oval} : {...styles.oval2} }>
            <Image
              source={currentIndex === 0 ? require('../../Assets/daoGeneralInfo.png') : require('../../Assets/checkmark.png')}
              style={styles.iconBlue}
            />
          </View>
          <View style={ currentIndex === 1 ?  {...styles.oval} : {...styles.oval2} }>
            <Image
              source={ currentIndex <= 1 ? require('../../Assets/funding.png') : require('../../Assets/checkmark.png') }
              style={ currentIndex < 1 ? {...styles.iconGrey} : {...styles.iconBlue} }
            />
          </View>
          <View style={currentIndex === 2 ?  {...styles.oval} : {...styles.oval2} }>
            <Image
              source={ currentIndex <= 2 ? require('../../Assets/agenda.png') : require('../../Assets/checkmark.png') }
              style={ currentIndex < 2 ? {...styles.iconGrey} : {...styles.iconBlue} }
            />
          </View>
          <View style={ currentIndex === 3 ?  {...styles.oval} : {...styles.oval2} }>
            <Image
              source={ currentIndex <= 3 ? require('../../Assets/members24.png') : require('../../Assets/checkmark.png') }
              style={ currentIndex < 3 ? {...styles.iconGrey} : {...styles.iconBlue} }
            />
          </View>
        </View>
        <Swiper
          ref={swiper}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          scrollEnabled={false}>
          <CreateStep1 />
          <CreateStep2 />
          <CreateStep3 />
          <CreateStep4 />
        </Swiper>

        <TouchableOpacity style={styles.continueButton} onPress={nextIndex}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '700',
            }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  oval: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oval2: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
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
  readMoreButton: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.mainBlue,
  },
  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    marginTop: 25,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
});

export default inject('completeAccountFormStore')(observer(CreateCommon));

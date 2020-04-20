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
import Icon from '../../Assets/iconfont/Icon';
import * as Progress from 'react-native-progress';
const {width} = Dimensions.get('window');
import Swiper from 'react-native-swiper';

const CreateCommon = (props) => {
  const [common, setCommon] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiper = useRef(null);

  useEffect(() => {
    swiper.current.scrollTo(currentIndex);
    console.log('AAAA', currentIndex);
  }, [currentIndex]);

  const progressList = [0, 0.35, 0.7, 1.0];

  nextIndex = () => {
    if (currentIndex < 3) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(3);
    }
    console.log(currentIndex);
  };

  // changeIndex = () => {
  //   setCurrentIndex(0);
  // };

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
          <TouchableOpacity onPress={() => setCurrentIndex(0)}>
            <View
              style={currentIndex === 0 ? {...styles.oval} : {...styles.oval2}}>
              <Image
                source={
                  currentIndex === 0
                    ? require('../../Assets/daoGeneralInfo.png')
                    : require('../../Assets/checkmark.png')
                }
                style={styles.iconBlue}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentIndex(1)}>
            <View
              style={currentIndex === 1 ? {...styles.oval} : {...styles.oval2}}>
              <Image
                source={
                  currentIndex <= 1
                    ? require('../../Assets/funding.png')
                    : require('../../Assets/checkmark.png')
                }
                style={
                  currentIndex < 1 ? {...styles.iconGrey} : {...styles.iconBlue}
                }
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentIndex(2)}>
            <View
              style={currentIndex === 2 ? {...styles.oval} : {...styles.oval2}}>
              <Image
                source={
                  currentIndex <= 2
                    ? require('../../Assets/agenda.png')
                    : require('../../Assets/checkmark.png')
                }
                style={
                  currentIndex < 2 ? {...styles.iconGrey} : {...styles.iconBlue}
                }
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentIndex(3)}>
            <View
              style={currentIndex === 3 ? {...styles.oval} : {...styles.oval2}}>
              <Image
                source={
                  currentIndex <= 3
                    ? require('../../Assets/members24.png')
                    : require('../../Assets/checkmark.png')
                }
                style={
                  currentIndex < 3 ? {...styles.iconGrey} : {...styles.iconBlue}
                }
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* <Swiper
          ref={swiper}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          // width={width-48}
          // index={currentIndex}
          // scrollEnabled={false}
          style={{overflow: 'visible'}}>
          <CreateStep1 />
          <CreateStep2 />
          <CreateStep3 />
          <CreateStep4 />
        </Swiper> */}

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

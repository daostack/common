import React,{useState, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, font, sizeXXL, sizeLineHeight, layout} from '~/Theme';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import logger from '../Services/Logger';
import {object} from 'prop-types';
import {NAVIGATION_SCREENS} from '../Util/constants/routes.enum';

const ONBOARDING_SLIDERS_AMOUNT = 3;

const Onboarding = () => {
  const navigation = useNavigation();
  const ref = useRef<Swiper>(null);
  const [index, setIndex] = useState(0);
  const _onboardingClick = async () => {
    try {
      await AsyncStorage.setItem('onboarded', 'true');
      messaging().requestPermission();
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: NAVIGATION_SCREENS.COMMON_HOME,
              params: {user: 'jane'},
            },
          ],
        }),
      );
    } catch (e) {
      logger.log(e);
    }
  };

  const onPress = () => {
    if (index === ONBOARDING_SLIDERS_AMOUNT) {
      _onboardingClick();
    } else {
      ref?.current?.scrollBy(1);
      setIndex(index + 1);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Image
              source={require('~/Assets/newLogoMobile.png')}
              style={styles.logo}
            />
          </View>
          <Swiper
            ref={ref}
            loadMinimal={true}
            style={styles.wrapper}
            showsButtons={false}
            activeDotColor={colors.mainBlue}
            onIndexChanged={(slideIndex) => setIndex(slideIndex)}
            paginationStyle={{bottom: 0}}>
            <View style={styles.slide1}>
              <Image
                source={require('~/Assets/creating-a-common.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Join a Common or launch a new one</Text>
              <Text style={styles.subtitle}>
                Collaborate on shared agendas by pooling funds and collectively
                making decisions.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('~/Assets/volunteering.png')}
                style={styles.image}
              />
              <Text style={styles.text}>
                Vote and make funding decisions together
              </Text>
              <Text style={styles.subtitle}>
                All members get an equal vote and can take part in the shared
                effort.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('~/Assets/transparent.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Operate in complete transparency</Text>
              <Text style={styles.subtitle}>
                All discussions, decisions, and expenses are visible to all
                Common members.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('~/Assets/CommonExplanation/crowd.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Harness the power of communities</Text>
              <Text style={styles.subtitle}>
                There's no limit to what we can achieve when working together.
                By getting everyone involved, more people will actively promote
                the cause.
              </Text>
            </View>
          </Swiper>

          <View style={styles.buttonConatiner}>
            <TouchableOpacity
              style={styles.button}
              onPress={onPress}>
              <Text style={styles.buttonText}>{index === ONBOARDING_SLIDERS_AMOUNT ? 'Get started' : 'Continue' }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

Onboarding.propTypes = {
  navigation: object,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  body: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
  },
  sectionContainer: {
    ...layout.marginTopL,
    marginBottom: 34,
    alignItems: 'center',
  },
  buttonConatiner: {
    ...layout.marginBottomL,
    ...layout.marginTopL,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 24,
    backgroundColor: colors.mainBlue,
  },
  buttonText: {
    color: colors.white,
    ...font.primary.regular,
    ...font.fontSize(4),
    ...layout.paddingVerticalM,
  },
  logo: {
    height: 40,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  image: {
    top: 0,
    width: '100%',
    height: '60%',
    aspectRatio: 1,
  },
  wrapper: {},
  slide1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    paddingHorizontal: 32,
    textAlign: 'center',
    color: colors.black,
    ...font.heading.bold,
    ...font.fontSize(6),
  },
  subtitle: {
    paddingHorizontal: 24,
    lineHeight: sizeLineHeight,
    paddingTop: 8,
    paddingBottom: sizeXXL,
    textAlign: 'center',
    color: colors.black,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
});

export default Onboarding;

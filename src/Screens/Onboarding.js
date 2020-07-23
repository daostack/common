import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors, font, sizeXXL, sizeLineHeight, layout} from '../Theme';
import {CommonActions} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-community/async-storage';

const Onboarding = ({navigation}) => {
  const _onboardingClick = async () => {
    try {
      await AsyncStorage.setItem('onboarded', 'true');
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'CommonHome',
              params: {user: 'jane'},
            },
          ],
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
          <Image
                source={require('../Assets/appLogo.png')}
                style={styles.logo}
              />
          </View>
          <Swiper
            loadMinimal={true}
            style={styles.wrapper}
            showsButtons={false}
            activeDotColor={colors.mainBlue}
            paginationStyle={{bottom: 0}}>
            <View style={styles.slide1}>
              <Image
                source={require('../Assets/creating-a-common.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Join a Common or launch a new one</Text>
              <Text style={styles.subtitle}>
              Collaborate on shared agendas by pooling funds and collectively making decisions.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('../Assets/CommonExplanation/funds.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Vote and make funding decisions together</Text>
              <Text style={styles.subtitle}>
              All members get an equal vote and
can take part in the shared effort.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('../Assets/CommonExplanation/decentralised.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Operate in complete transparency</Text>
              <Text style={styles.subtitle}>
              All discussions, decisions, and expenses are visible to all Common members.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('../Assets/CommonExplanation/crowd.png')}
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
              onPress={() => _onboardingClick(navigation)}>
              <Text style={styles.buttonText}>Get started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    backgroundColor: Colors.white,
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
    height: 26,
    resizeMode: 'contain',
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

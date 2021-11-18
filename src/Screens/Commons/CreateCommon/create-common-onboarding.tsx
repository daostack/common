import React, {useState, useRef} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {colors, font, sizeXXL, sizeLineHeight, layout} from '~/Theme';
import Swiper from 'react-native-swiper';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {useNavigation} from '@react-navigation/core';

const COMMON_EXPLANATION_SLIDERS_AMOUNT = 3;

export const CreateCommonOnboarding: React.FC = () => {
  const navigation = useNavigation();
  const ref = useRef<Swiper>(null);
  const [index, setIndex] = useState(0);

  const onPress = () => {
    if (index === COMMON_EXPLANATION_SLIDERS_AMOUNT) {
      navigation.navigate(NAVIGATION_SCREENS.CREATE_STEP_1);
    } else {
      ref.current?.scrollBy(1);
      setIndex(index + 1);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
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
                source={require('~/Assets/CommonExplanation/common.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Create a Common</Text>
              <Text style={styles.subtitle}>
                Collaborate on shared agendas by pooling funds and collectively
                making decisions.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('~/Assets/CommonExplanation/funds.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Invite members and pool funds</Text>
              <Text style={styles.subtitle}>
                Invite others to join your Common. Easily pool funds from all
                members and work together to advance your cause.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('~/Assets/CommonExplanation/decentralised.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Work as a collective</Text>
              <Text style={styles.subtitle}>
                All members get an equal vote and can take part in the shared
                effort.
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>
                {index === COMMON_EXPLANATION_SLIDERS_AMOUNT
                  ? 'Get started'
                  : 'Continue'}
              </Text>
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
  },
  body: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionContainer: {
    ...layout.marginTopL,
    marginBottom: 34,
  },
  buttonContainer: {
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

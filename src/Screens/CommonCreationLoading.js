import React, {useRef, useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors, layout, text} from '../Theme';
import {observer, inject} from 'mobx-react';
import Swiper from 'react-native-swiper';
import NavigationHeader from '../Util/NavigationHeader';

const CommonCreationLoading = ({daoStore, route, navigation}) => {
  const _swiper = useRef();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <NavigationHeader navigation={navigation} title="Common!" />
        <View style={styles.body}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            activeDotColor={colors.mainBlue}
            autoplay={false}
            showsPagination={false}
            index={daoStore.stage}
            paginationStyle={{bottom: 0}}
            ref={_swiper}
            scrollEnabled={false}>
            <View style={styles.slide1}>
              <Text style={styles.text}>Creating your common</Text>
              <Text style={styles.subtitle}>This may take a few minutes</Text>
              <Image
                source={require('../Assets/loader-1-analyzing.png')}
                style={styles.image}
              />
              <Text style={styles.bottomText}>
                Analyzing common information
              </Text>
            </View>
            <View style={styles.slide1}>
              <Text style={styles.text}>Creating your common</Text>
              <Text style={styles.subtitle}>This may take a few minutes</Text>
              <Image
                source={require('../Assets/loader-2-securing-on-the-blockchain.png')}
                style={styles.image}
              />
              <Text style={styles.bottomText}>
                Securing data on the blockchain
              </Text>
            </View>
            <View style={styles.slide1}>
              <Text style={styles.text}>Creating your common</Text>
              <Text style={styles.subtitle}>This may take a few minutes</Text>
              <Image
                source={require('../Assets/loader-3-some-final-touches.png')}
                style={styles.image}
              />
              <Text style={styles.bottomText}>Making some final touches</Text>
            </View>
            <View style={styles.slide1}>
              <Text style={styles.text}>Creating your common</Text>
              <Text style={styles.subtitle}>This may take a few minutes</Text>
              <Image
                source={require('../Assets/loader-4-drumroll.png')}
                style={styles.image}
              />
              <Text style={styles.bottomText}>Drumroll...</Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('../Assets/launch.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Your journey starts now</Text>
              <Text style={styles.subtitle}>
                Spread the word and invite others to partake in it. You can
                always share later
              </Text>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={daoStore.creationError}>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'white',
                    fontWeight: '700',
                  }}>
                  Share Common
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...layout.btnOutline,
                  ...styles.shareButton,
                }}
                onPress={() => {}}>
                <Text style={text.buttonblue}>Goto Common</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text />
            </View>
          </Swiper>
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
    marginTop: 22,
    marginBottom: 34,
  },
  buttonConatiner: {
    marginTop: 22,
    marginBottom: 22,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 24,
    backgroundColor: '#3cc7e1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  shareButton: {
    width: '80%',
    alignSelf: 'center',
  },
  continueButton: {
    width: '80%',
    height: 48,
    alignSelf: 'center',
    borderRadius: 32,
    marginTop: 45,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
  sectionTitle: {
    fontSize: 20,
    //   fontFamily: 'Roboto',
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
  },
  image: {
    top: 0,
    width: '100%',
    height: '70%',
    // backgroundColor: '#efefef',
  },
  wrapper: {},
  slide1: {
    flex: 1,
  },
  text: {
    paddingHorizontal: 33,
    paddingVertical: 10,
    textAlign: 'center',
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  subtitle: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    textAlign: 'center',
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  bottomText: {
    ...text.runningboldblue,
    paddingHorizontal: 40,
    paddingVertical: 10,
    textAlign: 'center',
    color: colors.mainBlue,
    fontSize: 14,
    fontFamily: 'Roboto',
  },
});

export default inject(
  'createCommonFormStore',
  'daoStore',
)(observer(CommonCreationLoading));

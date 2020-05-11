import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors, text} from '../Theme';
import {observer, inject} from 'mobx-react';
import Swiper from 'react-native-swiper';

const CommonCreationLoading = ({navigation}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            activeDotColor={colors.mainBlue}
            autoplay={true}
            paginationStyle={{bottom: 0}}>
            <View style={styles.slide1}>
              <Text style={styles.text}>Creating your common</Text>
              <Text style={styles.subtitle}>
                This may take a few minutes
              </Text>
              <Image
                source={require('../Assets/loader-1-analyzing.png')}
                style={styles.image}
              />
            </View>
            <View style={styles.slide1}>
              <Text style={styles.text}>Creating your common</Text>
              <Text style={styles.subtitle}>
                This may take a few minutes
              </Text>
              <Image
                source={require('../Assets/loader-2-securing-on-the-blockchain.png')}
                style={styles.image}
              />
            </View>
            <View style={styles.slide1}>
              <Text style={styles.text}>Creating your common</Text>
              <Text style={styles.subtitle}>
                This may take a few minutes
              </Text>
              <Image
                source={require('../Assets/loader-3-some-final-touches.png')}
                style={styles.image}
              />
            </View>
            <View style={styles.slide1}>
              <Text style={styles.text}>
                Creating your common
              </Text>
              <Text style={styles.subtitle}>
                This may take a few minutes
              </Text>
              <Image
                source={require('../Assets/loader-4-drumroll.png')}
                style={styles.image}
              />
              <Text style={styles.subtitle}>
                This may take a few minutes
              </Text>
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
});

export default inject('createCommonFormStore')(observer(CommonCreationLoading));

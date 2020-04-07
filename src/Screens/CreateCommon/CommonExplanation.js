import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
import Swiper from 'react-native-swiper';
const {width} = Dimensions.get('window');

const CommonExplanation = ({navigation}) => {
  const [common, setCommon] = useState(false);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          {/* <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Common!</Text>
          </View> */}

          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            activeDotColor={colors.mainBlue}
            autoplay={true}
            paginationStyle={{bottom: 0}}>
            <View style={styles.slide1}>
              <Image
                source={require('../../Assets/common.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Create a Common</Text>
              <Text style={styles.subtitle}>
                Organize a community to work together for a cause you care about
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('../../Assets/funds.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Raise the funds you need</Text>
              <Text style={styles.subtitle}>
                Set the amount of money you want to raise to reach your goal and
                how much each member should donate.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('../../Assets/crowd.png')}
                style={styles.image}
              />
              <Text style={styles.text}>Harness the power of the crowd</Text>
              <Text style={styles.subtitle}>
                All members of the common has equal weight in the decision
                making process. From what action you should take, through how to
                spend the money and even who should be a member.
              </Text>
            </View>
            <View style={styles.slide1}>
              <Image
                source={require('../../Assets/decentralised.png')}
                style={styles.image}
              />
              <Text style={styles.text}>
                Keep things completely decentralised
              </Text>
              <Text style={styles.subtitle}>
                All members of the common has equal weight in the decision
                making process. From what action you should take, through how to
                spend the money and even who should be a member.
              </Text>
            </View>
          </Swiper>

          <View style={styles.buttonConatiner}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('CreateStep1')}>
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

export default inject('createCommonFormStore')(observer(CommonExplanation));

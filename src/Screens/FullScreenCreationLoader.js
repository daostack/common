import React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {colors, layout, text} from '../Theme';
import Loader from '../Components/Loader';

const FullScreenCreationLoader = ({daoStore, route, navigation}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <View style={{...styles.slide1, ...layout.content}}>
            <Image
              source={require('../Assets/loader-4-drumroll.png')}
              style={styles.image}
            />
            <Loader />
            <Text
              style={{
                ...text.h2Black,
                ...layout.marginTopXL,
                ...layout.marginBottomS,
              }}>
              {route.params.title}
            </Text>
            <Text
              style={{
                ...text.runningblack,
                lineHeight: 18,
                textAlign: 'center',
              }}>
              {route.params.message}
            </Text>
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
    height: '50%',
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

export default FullScreenCreationLoader;

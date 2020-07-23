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
import {colors, layout, font, text} from '../Theme';
import Loader from '../Components/Loader';

const FullScreenCreationLoader = ({daoStore, route: {params: {title = '', message = ''}}, navigation}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <View style={{...styles.slide1, ...layout.content}}>
            <Image
              source={require('../Assets/creating-a-common.png')}
              style={styles.image}
            />
            <Text style={styles.creatingText}>{title}</Text>
            <Text style={styles.waitText}>
              {message}
            </Text>
            <Loader />
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
  creatingText: {
    ...font.heading.bold,
    ...font.fontSize(6),
    ...layout.marginTopXL,
    ...layout.marginBottomXL,
  },
  waitText: {
    ...font.primary.regular,
    ...font.fontSize(4),
    textAlign: 'center',
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
});

export default FullScreenCreationLoader;

import React, {useRef} from 'react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import BottomSheetContainer from '../Components/BottomSheetContainer';
import AcordionBtn from '../Components/AcordionBtn';

import GSignInButton from '../Components/GSignInButton';

// import Icon from '../Assets/iconfont/Icon';
import {layout} from '../Theme';

const CreateAccount = ({navigation}) => {
  bottomSheetContainerRef = useRef();

  openSheet = () => {
    bottomSheetContainerRef.current.snapTo(1);
  };

  onSignIn = () => {
    console.log('Signed in callbaack!');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <Button
              style={layout.marginTopM}
              title="button"
              onPress={openSheet}></Button>

            <View style={styles.sectionContainer}>
              <Image source={require('../Assets/accountPlaceHolder.png')} />
            </View>

            <GSignInButton
              navigation={navigation}
              style={styles.googleSignInButton}
            />

            <View style={styles.buttonsArea}>
              <AcordionBtn name="FAQ" />
              <AcordionBtn name="Terms of use" />
              <AcordionBtn name="Privacy Policy" />
              <AcordionBtn name="Help" />
              <AcordionBtn name="Contact us" />
            </View>

            <BottomSheetContainer
              ref={bottomSheetContainerRef}></BottomSheetContainer>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 22,
    marginBottom: 34,
  },
  googleSignInButton: {
    alignSelf: 'stretch',
    height: 56,
    borderWidth: 1,
    borderRadius: 28,
    borderStyle: 'solid',
    borderColor: '#eeeeee',

    shadowOpacity: 0,
    shadowColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 0,
    elevation: 0,
  },
  buttonsArea: {
    alignSelf: 'stretch',
    marginTop: 60,
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
});

export default CreateAccount;

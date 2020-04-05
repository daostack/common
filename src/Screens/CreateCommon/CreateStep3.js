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
  Animated,
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import {colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {observer, inject} from 'mobx-react';
const {width, height} = Dimensions.get('window');
import CreateStepHeader from './CreateStepHeader';
import NavigationBar from 'react-native-navbar';
import CreateStepNavigation from './CreateStepNavigation';

const CreateStep3 = props => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [segmentedIndex, setSegmentedIndex] = useState(0);
  const [pickDate, setPickDate] = useState('Custom');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 125],
      extrapolate: 'clamp',
    });
    console.log(height);
    // const height = scrollY.value > 100 ? 125 : 0;
    setHeaderHeight(height);
  }, [scrollY]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <CreateStepNavigation
        navigation={props.navigation}
        title="Funding"
      />
      <Animated.View style={[styles.header, {height: headerHeight}]}>
        <View style={styles.bar}>
          <View
            style={{
              marginTop: 80,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot2} />
          </View>
          <Text style={styles.title}>Funding</Text>
        </View>
      </Animated.View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        width={width}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event([
          {nativeEvent: {contentOffset: {y: scrollY}}},
        ])}>
        <CreateStepHeader currentIndex={2} />
        <View
          style={{
            flex: 1,
            // padding: 24,
            backgroundColor: 'white',
          }}>
          <Text
            style={{
              marginTop: 24,
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
            }}>
            Agenda
          </Text>
          <Text style={{marginTop: 12, marginBottom: 23, textAlign: 'center'}}>
            Describe your cause so people will understand what you want to
            achieve and how
          </Text>
          <TextInputField
            value={''}
            viewStyle={{alignSelf: 'stretch'}}
            label="Course of action"
            numberOfLines={6}
            multiline={true}
            placeholderText="What action are you planning to take to fulfil your goal? Are there things this common will not do?"
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: 'action',
              formStore: props.completeAccountFormStore,
              validateRule: 'required',
            }}
          />
          <Text
            style={{
              marginTop: 24,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Rules of conduct
          </Text>
          <Text
            style={{
              marginVertical: 15,
              fontSize: 12,
              color: colors.grey3,
            }}>
            Any restrictions members should know about (Advertising in common
            discussion, accepted language, you do not talk about Fight Club
            etc.)
          </Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => props.navigation.navigate('CreateStep4')}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '700',
            }}>
            Continue to Review
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: colors.white,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 2,
    height: 50,
  },
  placeholderText: {
    color: colors.grey3,
  },
  text: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.black,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.grey5,
    borderColor: colors.mainBlue,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  dot2: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.grey5,
    borderColor: colors.grey3,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    overflow: 'hidden',
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    // bottomborder: 'solid',
  },
  title: {
    backgroundColor: 'transparent',
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  readMoreButton: {
    fontSize: 12,
    // fontWeight: '700',
    color: colors.grey3,
  },
  continueButton: {
    width: '100%',
    height: 48,
    borderRadius: 32,
    marginTop: 45,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
});

export default inject('completeAccountFormStore')(observer(CreateStep3));

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
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './CreateStepHeader';
import NavigationBar from 'react-native-navbar';

const CreateStep1 = (props) => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);

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
      <NavigationBar
        statusBar={{hidden: true}}
        style={{borderBottomWidth: 1, borderBottomColor: colors.grey4}}
        title={{
          title: 'Create a common',
        }}
        leftButton={
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => props.navigation.pop()}>
            <Image
              source={require('../../Assets/backArrow.png')}
              style={{
                resizeMode: 'contain',
                width: 32,
                height: 32,
                marginLeft: 20,
              }}
            />
          </TouchableOpacity>
        }
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
            <View style={styles.dot2} />
            <View style={styles.dot2} />
            <View style={styles.dot2} />
          </View>
          <Text style={styles.title}>General info</Text>
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
        <CreateStepHeader currentIndex={0} />
        <View
          style={{
            flex: 1,
            // alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <Text
            style={{
              marginTop: 14,
              fontWeight: '700',
              fontSize: 18,
              textAlign: 'center',
            }}>
            General Info
          </Text>
          <Text style={{marginTop: 12, marginBottom: 23, textAlign: 'center'}}>
            Describe your cause so people will understand what you want to
            achieve and how
          </Text>
          <View
            style={{
              backgroundColor: colors.grey4,
              height: 1,
              marginBottom: 40,
            }}
          />
          <TextInputField
            value={''}
            viewStyle={{alignSelf: 'stretch'}}
            label="Common name"
            infoLabel="Required"
            placeholderText=""
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: 'name',
              formStore: props.completeAccountFormStore,
              validateRule: 'required',
            }}
          />
          <TextInputField
            value={''}
            viewStyle={{alignSelf: 'stretch'}}
            label="Byline"
            infoLabel="Required"
            numberOfLines={3}
            multiline={true}
            placeholderText="A sentence that describes what you want to achieve"
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: 'byline',
              formStore: props.completeAccountFormStore,
              validateRule: 'required',
            }}
          />
          <TextInputField
            value={''}
            label="Description"
            numberOfLines={5}
            multiline={true}
            placeholderText="Give some more detail about your cause, how are you going to support it, why you are passionate about it and why others should join."
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: 'description',
              formStore: props.completeAccountFormStore,
              validateRule: '',
            }}
          />
          <TextInputField
            value={''}
            viewStyle={{}}
            label="Add link"
            infoLabel="Resources, related content or social pages"
            placeholderText=""
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: 'link',
              formStore: props.completeAccountFormStore,
              validateRule: 'string',
            }}
          />
          <View style={{width: '100%'}}>
            <TouchableOpacity>
              <Text style={styles.readMoreButton}>Add Link</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => props.navigation.navigate('CreateStep2')}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '700',
            }}>
            Continue to Funding
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.mainBlue,
  },
  continueButton: {
    width: '100%',
    height: 48,
    borderRadius: 32,
    marginTop: 25,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
});

export default inject('completeAccountFormStore')(observer(CreateStep1));

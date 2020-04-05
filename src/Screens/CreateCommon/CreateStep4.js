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
import {colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {observer, inject} from 'mobx-react';
const {width, height} = Dimensions.get('window');
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';

const CreateStep4 = (props) => {
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
      <CreateStepNavigation navigation={props.navigation} title="Agenda" />
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
            <View style={styles.dot} />
          </View>
          <Text style={styles.title}>Review</Text>
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
        <CreateStepHeader currentIndex={3} />
        <View
          style={{
            flex: 1,
            // alignItems: 'center',
            // padding: 24,
            backgroundColor: 'white',
          }}>
          <Text
            style={{
              marginTop: 24,
              fontWeight: '700',
              fontSize: 18,
              textAlign: 'center',
            }}>
            Final touches and review
          </Text>
          <Text
            style={{
              marginTop: 12,
              marginBottom: 23,
              textAlign: 'center',
              marginHorizontal: 20,
            }}>
            You will not be able to make changes to the common info after it is
            published
          </Text>
          <View style={styles.image}>
            {/* <Image source={require('../../Assets/funds.png')} resizeMode='cover' /> */}
            {/* <Text>Placeholder</Text> */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              marginVertical: 15,
            }}>
            <Text style={{flex: 1, alignSelf: 'flex-start'}}>
              Have an avatar for you Common?
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'flex-end',
                  flex: 1,
                  color: colors.mainBlue,
                  fontSize: 16,
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                Upload avatar
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{height: 1, width: width, backgroundColor: colors.grey4}}
          />
          <View style={styles.sectionTitle}>
            <View style={{width: 90, marginRight: 10}}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                $10K
              </Text>
              <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
                Goal
              </Text>
            </View>
            <View style={{width: 90, marginHorizontal: 10}}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                $10
              </Text>
              <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
                Contribution
              </Text>
            </View>
            <TouchableOpacity
              style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
              <Icon
                name="edit"
                size={16}
                style={{textAlign: 'right', alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionTitle}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>About</Text>
            <TouchableOpacity
              style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
              <Icon
                name="edit"
                size={16}
                style={{textAlign: 'right', alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.textContent}>
            We aim to ba a global non-profit initiative. Only small percentage
            of creative directors are women and we want to help change this
            through mentorship circles, portfolio reviews, talks & creative
            meetups.
          </Text>
          <>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                Course of action
              </Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>
              We created this community to help you along your journey. Links to
              sponsored content or brands will vote you out.
            </Text>
          </>
          <>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Link</Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>https://www.google.com/</Text>
          </>
          <>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Deadline</Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>03 April 2021</Text>
          </>
          <>
            <Text
              style={{
                fontSize: 14,
                marginTop: 20,
                paddingHorizontal: 24,
                color: colors.grey3,
              }}>
              Rule #1
            </Text>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                No promotions or spam
              </Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>
              We created this community to help you along your journey. Links to
              sponsored content or brands will vote you out.
            </Text>
          </>
          <>
            <Text
              style={{
                fontSize: 14,
                marginTop: 20,
                paddingHorizontal: 24,
                color: colors.grey3,
              }}>
              Rule #2
            </Text>
            <View style={styles.sectionTitle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                Be courteous and kind to others
              </Text>
              <TouchableOpacity
                style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
                <Icon
                  name="edit"
                  size={16}
                  style={{textAlign: 'right', alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textContent}>
              We're all in this together to create a nurturing enviroment. Let's
              teat everyone with resprct. Healthy debates are natural, but
              kindness is required.
            </Text>
          </>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          // onPress={() => props.navigation.navigate('CreateStep2')}
        >
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
  sectionTitle: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 10,
    flex: 1,
    paddingHorizontal: 24,
  },
  textContent: {
    fontSize: 14,
    marginTop: 0,
    paddingHorizontal: 24,
  },
});

export default inject('completeAccountFormStore')(observer(CreateStep4));

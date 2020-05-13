import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import CreateCommonForm from '../../Components/Forms/CreateCommonForm';
import RequestToJoinRule from '../../Components/Commons/RequestToJoinRule';

import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './RequestStepHeader';
import CreateStepDotHeader from './RequestStepDotHeader';
import {text, colors} from '../../Theme';
import CreateStepNavigation from './RequestStepNavigation';
import RequestStepActionButton from './RequestStepActionButton';

const RequestStep1 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  // const [ruleCount] = useState(1);
  const [pass, setPass] = useState(false);

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    console.log(height);
    // const height = scrollY.value > 100 ? 125 : 0;
    setHeaderHeight(height);
  }, [scrollY]);

  // TODO: why is this code not used?
  // const isValid = () => {
  //   const links = [...Array(ruleCount).keys()].map(
  //     x => `${CreateCommonForm.LINKS}_${x}`,
  //   );
  //   const result = props.requestToJoinFormStore.isFormValidSelectedFields([
  //     CreateCommonForm.NAME,
  //     CreateCommonForm.BYLINE,
  //     ...links,
  //   ]);
  //   setPass(result);
  //   return result;
  // };

  const onScrollToBottom = () => {
    setPass(true);
  };

  const push = () => {
    //const vaild = isValid();
    //if (vaild) {
    props.navigation.navigate('RequestStep2');
    console.log(props.requestToJoinFormStore.getChangedFormFieldsJson());
    //}
  };

  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <CreateStepNavigation
          navigation={props.navigation}
          title="Request to join"
        />
        <CreateStepDotHeader
          title="Approve Common Rules"
          currentIndex={1}
          navigation={props.navigation}
          headerHeight={headerHeight}
        />
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
          ])}
          onScrollEndDrag={onScrollToBottom}>
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
              Approve Common Rules
            </Text>
            <Text
              style={{
                ...text.blackText,
                marginTop: 12,
                marginBottom: 23,
                paddingHorizontal: 20,
                textAlign: 'center',
              }}>
              If the common approves your request you will become an equal
              member with voting rights.
            </Text>
            <View
              style={{
                backgroundColor: colors.grey4,
                height: 1,
                marginBottom: 40,
              }}
            />
            <RequestToJoinRule
              index={1}
              title="No promotions or spam"
              description="We created this community to help you along your journey. Links to sponsored content or brands will vote you out."
            />

            <RequestToJoinRule
              index={2}
              title="No promotions or spam"
              description="We created this community to help you along your journey. Links to sponsored content or brands will vote you out."
            />

            <RequestToJoinRule
              index={3}
              title="No promotions or spam"
              description="We created this community to help you along your journey. Links to sponsored content or brands will vote you out."
            />

            <RequestToJoinRule
              index={4}
              title="No promotions or spam"
              description="We created this community to help you along your journey. Links to sponsored content or brands will vote you out."
            />

            <RequestToJoinRule
              index={5}
              title="No promotions or spam"
              description="We created this community to help you along your journey. Links to sponsored content or brands will vote you out."
            />
          </View>
        </ScrollView>
        <RequestStepActionButton title="Continue" pass={pass} onPress={push} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  readMoreButton: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.mainBlue,
  },

  continueButton: {
    width: '100%',
    height: 48,
    borderRadius: 32,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
});

export default inject('requestToJoinFormStore')(observer(RequestStep1));

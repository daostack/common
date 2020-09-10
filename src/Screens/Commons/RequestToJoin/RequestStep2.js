import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import TextInputField from '../../../Components/FormFields/TextInputField';
import MultiLinkField from '../../../Components/FormFields/MultiLinkField';

import {colors, text} from '../../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';

import RequestToJoinForm from '../../../Components/Forms/RequestToJoinForm';
import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';
import MembershipRequest from './MembershipRequest';

const RequestStep2 = ({navigation, introduceYourselfFormStore, route:{params}}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const isFirstStepSkipped = params.skipFirstStep;
  const { name } = params.currCommon.name;

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  const push = () => {
    if (introduceYourselfFormStore.isFormValid()) {
      const navigate = CommonActions.navigate({
        name: 'RequestStep3',
        params: {
          currDaoId: params.currDaoId,
          currCommon: params.currCommon,
          skipFirstStep: isFirstStepSkipped,
        },
      });
      navigation.dispatch(navigate);
    }
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
          navigation={navigation}
          title={name}
        />
        <CreateStepDotHeader
          title="Introduce Yourself"
          currentIndex={2}
          isFirstStepSkipped={isFirstStepSkipped}
          navigation={navigation}
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
          ])}>
          <MembershipRequest />

          <CreateStepHeader
            isFirstStepSkipped={isFirstStepSkipped}
            currentIndex={1}
          />
          <View
            style={{
              flex: 1,
              // alignItems: 'center',
              // padding: 24,
              backgroundColor: 'white',
            }}>
            <RequestStepHeaderTitle title="Introduce Yourself" subtitle="Let the Common members learn more about you and how you relate to the cause." />
            <View
              style={{
                backgroundColor: colors.grey4,
                height: 1,
                marginBottom: 40,
              }}
            />
            <TextInputField
              label="Intro"
              infoLabel="Required"
              placeholderText="Let the Common members learn more about you and how you relate to the cause."
              multiline={true}
              numberOfLines={6}
              validation={{
                name: RequestToJoinForm.FIELD_ABOUT_ME,
                formStore: introduceYourselfFormStore,
                validateRule: 'required|string',
              }}
            />

            <Text style={{...text.h3Black, ...{textAlign: 'left'}}}>Links</Text>

            <MultiLinkField
              link
              allowsEditing={true}
              title="Title"
              validation={{
                name: RequestToJoinForm.FIELD_LINKS,
                formStore: introduceYourselfFormStore,
                validateRule: 'string|url',
              }}
            />
          </View>
        </ScrollView>
        <RequestStepActionButton
          title="Continue"
          pass={introduceYourselfFormStore.isFormActionEnabled()}
          onPress={push}
        />
      </SafeAreaView>
    </>
  );
};

export default inject(
  'userStore',
  'introduceYourselfFormStore',
)(observer(RequestStep2));

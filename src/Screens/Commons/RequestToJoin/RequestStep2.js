import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { CommonActions } from '@react-navigation/native';
import TextInputField from '../../../Components/FormFields/TextInputField';
import MultiLinkField from '../../../Components/FormFields/MultiLinkField';

import { colors, text } from '../../../Theme';
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';

import RequestToJoinForm from '../../../Components/Forms/RequestToJoinForm';
import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';
import MembershipRequest from './MembershipRequest';

const { width } = Dimensions.get('window');

const RequestStep2 = (props) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const isFirstStepSkipped = props.route.params.skipFirstStep;

  const { name } = props.daoStore.dao;

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  const push = () => {
    if (props.introduceYourselfFormStore.isFormValid()) {
      const navigate = CommonActions.navigate({
        name: 'RequestStep3',
        params: {
          currDaoId: props.route.params.currDaoId,
          skipFirstStep: isFirstStepSkipped,
        },
      });
      props.navigation.dispatch(navigate);
    }
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        <CreateStepNavigation
          navigation={props.navigation}
          title={name}
        />
        <CreateStepDotHeader
          title="Introduce Yourself"
          currentIndex={2}
          isFirstStepSkipped={isFirstStepSkipped}
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
            { nativeEvent: { contentOffset: { y: scrollY } } },
          ])}
        >
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
            }}
          >
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
              multiline
              numberOfLines={6}
              validation={{
                name: RequestToJoinForm.FIELD_ABOUT_ME,
                formStore: props.introduceYourselfFormStore,
                validateRule: 'required|string',
              }}
            />

            <Text style={{ ...text.h3Black, ...{ textAlign: 'left' } }}>Links</Text>

            <MultiLinkField
              allowsEditing
              title="Title"
              validation={{
                name: RequestToJoinForm.FIELD_LINKS,
                formStore: props.introduceYourselfFormStore,
                validateRule: 'string|url',
              }}
            />
          </View>
        </ScrollView>
        <RequestStepActionButton
          title="Continue"
          pass={props.introduceYourselfFormStore.isFormActionEnabled()}
          onPress={push}
        />
      </SafeAreaView>
    </>
  );
};

export default inject(
  'userStore',
  'introduceYourselfFormStore',
  'daoStore',
)(observer(RequestStep2));

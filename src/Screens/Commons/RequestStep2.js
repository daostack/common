import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import MultiLinkField from '../../Components/FormFields/MultiLinkField';

import {colors, text, layout} from '../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';

import RequestToJoinForm from '../../Components/Forms/RequestToJoinForm';
import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from './RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';

const RequestStep2 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [pass, setPass] = useState(true);

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  const isValid = () => {
    const result = props.requestToJoinFormStore.isFormValidSelectedFields([
      RequestToJoinForm.FUNDING_GOAL,
      RequestToJoinForm.MINIMUM,
      RequestToJoinForm.DEADLINE,
    ]);
    setPass(result);
    return result;
  };

  const push = () => {
    const vaild = isValid();
    if (vaild) {
      const navigate = CommonActions.navigate({
        name: 'RequestStep3',
        params: {
          currDaoId: props.route.params.currDaoId,
        },
      });
      props.navigation.dispatch(navigate);
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
          navigation={props.navigation}
          title="Approve Common Rules"
        />
        <CreateStepDotHeader
          title="Introduce Yourself"
          currentIndex={2}
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
          ])}>
          <CreateStepHeader currentIndex={1} />
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
              Introduce Yourself
            </Text>
            <Text
              style={{
                marginTop: 12,
                marginBottom: 23,
                marginHorizontal: 20,
                textAlign: 'center',
              }}>
              Let the other common members know what you bring to the table
            </Text>
            <View
              style={{
                backgroundColor: colors.grey4,
                height: 1,
                marginBottom: 40,
              }}
            />

            <TextInputField
              label="About me"
              multiline={true}
              numberOfLines={6}
              validation={{
                name: RequestToJoinForm.FIELD_ABOUT_ME,
                formStore: props.requestToJoinFormStore,
                validateRule: 'string',
              }}
            />

            <Text style={{...text.h3Black, ...{textAlign: 'left'}}}>Links</Text>

            <MultiLinkField
              allowsEditing={true}
              title="Title"
              validation={{
                name: RequestToJoinForm.FIELD_LINKS,
                formStore: props.requestToJoinFormStore,
                validateRule: 'string',
              }}
            />
          </View>
        </ScrollView>
        <RequestStepActionButton title="Continue" pass={pass} onPress={push} />
      </SafeAreaView>
    </>
  );
};

export default inject(
  'userStore',
  'requestToJoinFormStore',
)(observer(RequestStep2));

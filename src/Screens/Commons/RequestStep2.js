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
import TextInputField from '../../Components/FormFields/TextInputField';
import MultiLinkField from '../../Components/FormFields/MultiLinkField';

import {colors, text, layout} from '../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './RequestStepHeader';
import CreateStepNavigation from './RequestStepNavigation';

import RequestToJoinForm from '../../Components/Forms/RequestToJoinForm';
import moment from 'moment';
import CreateStepDotHeader from './RequestStepDotHeader';
import RequestStepActionButton from './RequestStepActionButton';

const RequestStep2 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [segmentedIndex] = useState(0);
  const [pickDate] = useState('Custom');
  const [_show, setShow] = useState(false);
  const [pass, setPass] = useState(true);

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  useEffect(() => {
    const name = RequestToJoinForm.DEADLINE;
    props.requestToJoinFormStore.registerFormField(name, 'required');
    switch (segmentedIndex) {
      case 0: {
        props.requestToJoinFormStore.fieldChanged(
          name,
          moment()
            .add('7', 'days')
            .toDate(),
        );
        setShow(false);
        break;
      }
      case 1: {
        props.requestToJoinFormStore.fieldChanged(
          name,
          moment()
            .add('1', 'months')
            .toDate(),
        );
        setShow(false);
        break;
      }
      case 2: {
        props.requestToJoinFormStore.fieldChanged(
          name,
          moment(pickDate, 'MMM DD, YYYY').toDate(),
        );
        setShow(true);
        break;
      }
    }
  }, [segmentedIndex, pickDate, props.requestToJoinFormStore]);

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
      props.navigation.navigate('RequestStep3');
      console.log(props.requestToJoinFormStore.getChangedFormFieldsJson());
    }
  };

  const {userStore} = props;

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
  readMoreButton: {
    fontSize: 12,
    // fontWeight: '700',
    color: colors.grey3,
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
  infoLabel: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'italic',
    letterSpacing: 0,
    color: colors.paleblue,
    textAlign: 'right',
    flex: 1,
  },
  actionBtnContainer: {
    ...layout.content,
    backgroundColor: colors.white,
    shadowColor: 'rgba(79, 92, 105, 0.1)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
});

export default inject(
  'userStore',
  'requestToJoinFormStore',
)(observer(RequestStep2));

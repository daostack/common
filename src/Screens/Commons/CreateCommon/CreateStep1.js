import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import TextInputField from '../../../Components/FormFields/TextInputField';
import CreateCommonForm from '../../../Components/Forms/CreateCommonForm';
import {colors} from '../../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './CreateStepHeader';
import NavigationBar from 'react-native-navbar';
import Icon from '../../../Assets/iconfont/Icon';
import CreateStepDotHeader from './CreateStepDotHeader';
import MultiLinkField from '../../../Components/FormFields/MultiLinkField';

import RequestStepActionButton from '../RequestStepActionButton';

const CreateStep1 = props => {
  const [scrollY] = useState(new Animated.Value(0));
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

  const push = () => {
    if (props.generalInfoFormStore.isFormValid()) {
      props.navigation.navigate('CreateStep2');
    }
  };

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
            <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
          </TouchableOpacity>
        }
      />
      <CreateStepDotHeader
        title="General Info"
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
            returnKeyType="next"
            autoCorrect={false}
            validation={{
              name: CreateCommonForm.NAME,
              formStore: props.generalInfoFormStore,
              validateRule: 'required|max:24',
            }}
          />
          <TextInputField
            value={''}
            viewStyle={{alignSelf: 'stretch'}}
            label="Byline"
            infoLabel="Required"
            numberOfLines={3}
            // returnKeyType="next"
            multiline={true}
            placeholderText="A sentence that describes what you want to achieve"
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: CreateCommonForm.BYLINE,
              formStore: props.generalInfoFormStore,
              validateRule: 'required|min:10|max:40',
            }}
          />
          <TextInputField
            value={''}
            label="Description"
            infoLabel="Required"
            numberOfLines={5}
            multiline={true}
            returnKeyType="next"
            placeholderText="Give some more detail about your cause, how are you going to support it, why you are passionate about it and why others should join."
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: CreateCommonForm.DESCRIPTION,
              formStore: props.generalInfoFormStore,
              validateRule: 'required|string',
            }}
          />
          <MultiLinkField
            allowsEditing={true}
            title="Title"
            maxCount={5}
            validation={{
              name: CreateCommonForm.LINKS,
              formStore: props.generalInfoFormStore,
              validateRule: {common: 'string|url', title: 'string|max:30'},
            }}
          />
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Continue to Funding"
        pass={props.generalInfoFormStore.isFormActionEnabled()}
        onPress={push}
      />
    </SafeAreaView>
  );
};

export default inject(
  'generalInfoFormStore',
  'fundingFormStore',
  'agendaFormStore',
  'reviewFormStore',
  'daoStore',
)(observer(CreateStep1));

//generalInfoFormStore
//fundingFormStore
//agendaFormStore
//reviewFormStore

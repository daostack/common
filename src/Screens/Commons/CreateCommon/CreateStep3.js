import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import TextInputField from '~/Components/FormFields/TextInputField';
import {colors, font} from '~/Theme';
import {observer, inject} from 'mobx-react';
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import CreateCommonForm from '~/Components/Forms/CreateCommonForm';
import MultiLinkField from '~/Components/FormFields/MultiLinkField';
import CreateStepDotHeader from './CreateStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import CreateStepHeaderTitle from './CreateStepHeaderTitle';
import {object, func, shape} from 'prop-types';
const {width} = Dimensions.get('window');

const CreateStep3 = ({agendaFormStore, navigation}) => {
  const [ scrollY ] = useState(new Animated.Value(0));
  const [ headerHeight, setHeaderHeight ] = useState(0);

  // var ruleBody = [];

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [ 0, 50 ],
      outputRange: [ 0, 125 ],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [ scrollY ]);

  /*
  const handleRuleTitles = (x, text) => {
    props.agendaFormStore.registerFormField(`ruleTitles_${x}`, 'string');
    props.agendaFormStore.fieldChanged(`ruleTitles_${x}`, text);
  };

  const handleRuleBody = (x, text) => {
    props.agendaFormStore.registerFormField(`ruleBody_${x}`, 'string');
    props.agendaFormStore.fieldChanged(`ruleBody_${x}`, text);
  };


  const isValid = () => {
    const titles = [...Array(ruleCount).keys()].map(x => `ruleTitles_${x}`);
    const bodys = [...Array(ruleCount).keys()].map(x => `ruleBody_${x}`);

    const result = props.agendaFormStore.isFormValidSelectedFields([
      CreateCommonForm.ACTION,
      ...titles,
      ...bodys,
    ]);
    setPass(result);
    return result;
  };

  */

  const push = () => {
    if (agendaFormStore.isFormValid()) {
      navigation.navigate('CreateStep4');
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <CreateStepNavigation navigation={navigation} title="Create a Common"/>
      <CreateStepDotHeader
        title="Additional Info"
        currentIndex={3}
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
        <CreateStepHeader currentIndex={2}/>
        <View
          style={{
            flex: 1,
            // padding: 24,
            backgroundColor: 'white',
          }}>
          <CreateStepHeaderTitle
            title="Additional Info"
            subtitle="Define your course of action and rules of conduct."
          />
          <TextInputField
            value={agendaFormStore.form.fields[CreateCommonForm.ACTION]?.value}
            viewStyle={{alignSelf: 'stretch'}}
            label="Course of action"
            infoLabel="Required"
            numberOfLines={6}
            multiline={true}
            placeholderText="How do you plan to promote your agenda? Anything you want to avoid? Keep it simple and relatively broad - your plans can always change as you go."
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: CreateCommonForm.ACTION,
              formStore: agendaFormStore,
              validateRule: 'string|required',
              displayName: 'course of action',
            }}
          />
          <Text
            style={{
              marginTop: 24,
              ...font.primary.bold,
              ...font.fontSize(3),
              ...font.lineHeight(2),
            }}>
            Rules of conduct
          </Text>
          <Text
            style={{
              ...font.primary.regular,
              ...font.fontSize(2),
              ...font.lineHeight(2),
              color: colors.grey3,
            }}>
            Use rules to set the tone for your Common's discussions.
            (No advertising and spam, accepted language, etc.)
          </Text>

          <MultiLinkField
            rule
            allowsEditing={true}
            title="Rule title"
            placeholderValueText="Rule description"
            multiline={true}
            addMultiFieldBtnName="Add Rule"
            validation={{
              name: CreateCommonForm.RULES,
              formStore: agendaFormStore,
              validateRule: {common: 'string', title: 'string|max:80'},
            }}
          />

          {/*
          {[...Array(ruleCount).keys()].map(x => (
            <View key={x}>
              <TextInput
                key={`title_${x}`}
                style={{
                  borderColor: colors.grey4,
                  padding: 10,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderWidth: 1,
                  marginTop: 20,
                }}
                onChangeText={text => handleRuleTitles(x, text)}
                placeholder="Rule title"
              />
              <TextInput
                key={`body_${x}`}
                style={{
                  borderColor: colors.grey4,
                  padding: 10,
                  borderWidth: 1,
                  borderTopWidth: 0,
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  height: 100,
                }}
                onChangeText={text => handleRuleBody(x, text)}
                multiline={true}
                numberOfLines={4}
                placeholder="Rule description"
              />
            </View>
          ))}

          <TouchableOpacity onPress={() => setRuleCount(ruleCount + 1)}>
            <Text
              style={{
                color: colors.mainBlue,
                fontSize: 16,
                fontWeight: '500',
                marginTop: 20,
              }}>
              Add rule
            </Text>
          </TouchableOpacity>
          */}
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Continue to Review"
        pass={agendaFormStore.isFormActionEnabled()}
        onPress={push}
      />
    </SafeAreaView>
  );
};

CreateStep3.propTypes = {
  agendaFormStore: shape({
    isFormValid: func,
    isFormActionEnabled: func,
  }),
  navigation: object,
};

export default inject(
  'generalInfoFormStore',
  'fundingFormStore',
  'agendaFormStore',
  'reviewFormStore',
)(observer(CreateStep3));

//generalInfoFormStore
//fundingFormStore
//agendaFormStore
//reviewFormStore

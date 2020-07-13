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
import {colors, font} from '../../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import CreateCommonForm from '../../../Components/Forms/CreateCommonForm';
import MultiLinkField from '../../../Components/FormFields/MultiLinkField';
import CreateStepDotHeader from './CreateStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import CreateStepHeaderTitle from './CreateStepHeaderTitle';

const CreateStep3 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);

  // var ruleBody = [];

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 125],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

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
    if (props.agendaFormStore.isFormValid()) {
      props.navigation.navigate('CreateStep4');
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <CreateStepNavigation navigation={props.navigation} title="Funding" />
      <CreateStepDotHeader
        title="Agenda"
        currentIndex={3}
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
        <CreateStepHeader currentIndex={2} />
        <View
          style={{
            flex: 1,
            // padding: 24,
            backgroundColor: 'white',
          }}>
          <CreateStepHeaderTitle
            title="Agenda"
            subtitle="Describe your cause so people will understand what you want to
            achieve and how"
          />
          <TextInputField
            value={''}
            viewStyle={{alignSelf: 'stretch'}}
            label="Course of action"
            infoLabel="Required"
            numberOfLines={6}
            multiline={true}
            placeholderText="What action are you planning to take to fulfil your goal? Are there things this common will not do?"
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: CreateCommonForm.ACTION,
              formStore: props.agendaFormStore,
              validateRule: 'string|required',
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
            Any restrictions members should know about (Advertising in common
            discussion, accepted language, you do not talk about Fight Club
            etc.)
          </Text>

          <MultiLinkField
            allowsEditing={true}
            title="Rule title"
            placeholderValueText="Rule description"
            multiline={true}
            addMultiFieldBtnName="Add Rule"
            validation={{
              name: CreateCommonForm.RULES,
              formStore: props.agendaFormStore,
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
        pass={props.agendaFormStore.isFormActionEnabled()}
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
)(observer(CreateStep3));

//generalInfoFormStore
//fundingFormStore
//agendaFormStore
//reviewFormStore

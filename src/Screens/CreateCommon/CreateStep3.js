import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
  TextInput,
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import {colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import CreateCommonForm from '../../Components/Forms/CreateCommonForm';
import CreateStepDotHeader from './CreateStepDotHeader';

const CreateStep3 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [ruleCount, setRuleCount] = useState(1);
  const [pass, setPass] = useState(false);
  // var ruleBody = [];

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

  const handleRuleTitles = (x, text) => {
    props.createCommonFormStore.registerFormField(`ruleTitles_${x}`, 'string');
    props.createCommonFormStore.fieldChanged(`ruleTitles_${x}`, text);
    // console.log(x, text, ruleTitles);
  };

  const handleRuleBody = (x, text) => {
    props.createCommonFormStore.registerFormField(`ruleBody_${x}`, 'string');
    props.createCommonFormStore.fieldChanged(`ruleBody_${x}`, text);
  };

  const isValid = () => {
    const titles = [...Array(ruleCount).keys()].map(x => `ruleTitles_${x}`);
    const bodys = [...Array(ruleCount).keys()].map(x => `ruleBody_${x}`);

    const result = props.createCommonFormStore.isFormValidSelectedFields([
      CreateCommonForm.ACTION,
      ...titles,
      ...bodys,
    ]);
    setPass(result);
    return result;
  };

  const push = () => {
    const vaild = isValid();
    if (vaild) {
      props.navigation.navigate('CreateStep4');
      console.log(props.createCommonFormStore.getChangedFormFieldsJson());
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
          <Text
            style={{
              marginTop: 24,
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
            }}>
            Agenda
          </Text>
          <Text style={{marginTop: 12, marginBottom: 23, textAlign: 'center'}}>
            Describe your cause so people will understand what you want to
            achieve and how
          </Text>
          <TextInputField
            value={''}
            viewStyle={{alignSelf: 'stretch'}}
            label="Course of action"
            numberOfLines={6}
            multiline={true}
            placeholderText="What action are you planning to take to fulfil your goal? Are there things this common will not do?"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={isValid}
            validation={{
              name: CreateCommonForm.ACTION,
              formStore: props.createCommonFormStore,
              validateRule: 'string',
            }}
          />
          <Text
            style={{
              marginTop: 24,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Rules of conduct
          </Text>
          <Text
            style={{
              // marginVertical: 15,
              marginTop: 15,
              fontSize: 12,
              color: colors.grey3,
            }}>
            Any restrictions members should know about (Advertising in common
            discussion, accepted language, you do not talk about Fight Club
            etc.)
          </Text>

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
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            {backgroundColor: pass ? colors.mainBlue : colors.grey3},
          ]}
          onPress={push}>
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
});

export default inject('createCommonFormStore')(observer(CreateStep3));

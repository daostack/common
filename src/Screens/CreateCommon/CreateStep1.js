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
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import CreateCommonForm from '../../Components/Forms/CreateCommonForm';
import {colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './CreateStepHeader';
import NavigationBar from 'react-native-navbar';
import Icon from '../../Assets/iconfont/Icon';
import CreateStepDotHeader from './CreateStepDotHeader';

const CreateStep1 = props => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [ruleCount, setRuleCount] = useState(1);
  const [pass, setPass] = useState(false);

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

  const isValid = () => {
    const links = [...Array(ruleCount).keys()].map(
      x => `${CreateCommonForm.LINKS}_${x}`,
    );
    const result = props.createCommonFormStore.isFormValidSelectedFields([
      CreateCommonForm.NAME,
      CreateCommonForm.BYLINE,
      ...links,
    ]);
    setPass(result);
    return result;
  };

  const push = () => {
    const vaild = isValid();
    if (vaild) {
      props.navigation.navigate('CreateStep2');
      console.log(props.createCommonFormStore.getChangedFormFieldsJson());
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
            onChangeText={isValid}
            validation={{
              name: CreateCommonForm.NAME,
              formStore: props.createCommonFormStore,
              // validateRule: 'required|min:4',
              validateRule: 'required',
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
            onChangeText={isValid}
            validation={{
              name: CreateCommonForm.BYLINE,
              formStore: props.createCommonFormStore,
              validateRule: 'required|min:10',
            }}
          />
          <TextInputField
            value={''}
            label="Description"
            numberOfLines={5}
            multiline={true}
            returnKeyType="next"
            placeholderText="Give some more detail about your cause, how are you going to support it, why you are passionate about it and why others should join."
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: CreateCommonForm.DESCRIPTION,
              formStore: props.createCommonFormStore,
              validateRule: 'string',
            }}
          />
          {[...Array(ruleCount).keys()].map(x => (
            <TextInputField
              key={x}
              value={''}
              viewStyle={{marginTop: -5, marginBottom: -15}}
              label={x === 0 ? 'Add link' : ''}
              infoLabel={
                x === 0 ? 'Resources, related content or social pages' : ''
              }
              placeholderText="https://"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={isValid}
              validation={{
                name: `${CreateCommonForm.LINKS}_${x}`,
                formStore: props.createCommonFormStore,
                validateRule: 'string|url',
              }}
            />
          ))}
          <TouchableOpacity>
            <Text
              style={styles.readMoreButton}
              onPress={() => setRuleCount(ruleCount + 1)}>
              Add Link
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            {backgroundColor: pass ? colors.mainBlue : colors.grey3},
          ]}
          // onPress={() => props.navigation.navigate('CreateStep2')}
          onPress={push}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '700',
            }}>
            Continue to Funding
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    marginTop: 25,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
});

export default inject('createCommonFormStore')(observer(CreateStep1));

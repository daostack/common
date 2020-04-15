import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
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
import CreateCommonForm from '../../Components/Forms/CreateCommonForm';
import {colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import CreateStepHeader from './CreateStepHeader';
import NavigationBar from 'react-native-navbar';
import Icon from '../../Assets/iconfont/Icon';
import Toast from '../../Util/Toast.js';

const CreateStep1 = (props) => {
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
      (x) => `${CreateCommonForm.FIELD_LINKS}_${x}`,
    );
    const result = props.createCommonFormStore.isFormValidSelectedFields([
      CreateCommonForm.FIELD_NAME,
      CreateCommonForm.FIELD_BYLINE,
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
      <Animated.View style={[styles.header, {height: headerHeight}]}>
        <View style={styles.bar}>
          <View
            style={{
              marginTop: 80,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.dot} />
            <View style={styles.dot2} />
            <View style={styles.dot2} />
            <View style={styles.dot2} />
          </View>
          <Text style={styles.title}>General info</Text>
        </View>
      </Animated.View>
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
            autoCorrect={false}
            onChangeText={isValid}
            validation={{
              name: CreateCommonForm.FIELD_NAME,
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
            multiline={true}
            placeholderText="A sentence that describes what you want to achieve"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={isValid}
            validation={{
              name: CreateCommonForm.FIELD_BYLINE,
              formStore: props.createCommonFormStore,
              validateRule: 'required|min:10',
              // validateRule: 'required',
            }}
          />
          <TextInputField
            value={''}
            label="Description"
            numberOfLines={5}
            multiline={true}
            placeholderText="Give some more detail about your cause, how are you going to support it, why you are passionate about it and why others should join."
            autoCapitalize="none"
            autoCorrect={false}
            validation={{
              name: CreateCommonForm.FIELD_DESCRIPTION,
              formStore: props.createCommonFormStore,
              validateRule: 'string',
            }}
          />
          {[...Array(ruleCount).keys()].map((x) => (
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
                name: `${CreateCommonForm.FIELD_LINKS}_${x}`,
                formStore: props.createCommonFormStore,
                validateRule: 'string|url',
                // validateRule: 'string',
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
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.grey5,
    borderColor: colors.mainBlue,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  dot2: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.grey5,
    borderColor: colors.grey3,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    overflow: 'hidden',
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    // bottomborder: 'solid',
  },
  title: {
    backgroundColor: 'transparent',
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    paddingVertical: 10,
  },
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

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
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import {colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {observer, inject} from 'mobx-react';
const {width, height} = Dimensions.get('window');
import SegmentedControlTab from 'react-native-segmented-control-tab';
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import CreateCommonForm from '../../Components/Forms/CreateCommonForm';
import Modal from 'react-native-modal';
import moment from 'moment';

const CreateStep2 = props => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [segmentedIndex, setSegmentedIndex] = useState(0);
  const [pickDate, setPickDate] = useState('Custom');
  const [show, setShow] = useState(false);
  const [pass, setPass] = useState(false);

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 125],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  useEffect(() => {
    const name = CreateCommonForm.FIELD_DEADLINE;
    props.createCommonFormStore.registerFormField(name, 'required');
    switch (segmentedIndex) {
      case 0: {
        props.createCommonFormStore.fieldChanged(
          name,
          moment()
            .add('7', 'days')
            .toDate(),
        );
        setShow(false);
        break;
      }
      case 1: {
        props.createCommonFormStore.fieldChanged(
          name,
          moment()
            .add('1', 'months')
            .toDate(),
        );
        setShow(false);
        break;
      }
      case 2: {
        props.createCommonFormStore.fieldChanged(
          name,
          moment(pickDate, 'MMM DD, YYYY').toDate(),
        );
        setShow(true);
        break;
      }
    }
  }, [segmentedIndex, pickDate, props.createCommonFormStore]);

  const isValid = () => {
    const result = props.createCommonFormStore.isFormValidSelectedFields([
      CreateCommonForm.FIELD_FUNDING_GOAL,
      CreateCommonForm.FIELD_MINIMUM,
      CreateCommonForm.FIELD_DEADLINE,
    ]);
    setPass(result);
    return result;
  };

  const push = () => {
    const vaild = isValid();
    if (vaild) {
      props.navigation.navigate('CreateStep3');
      console.log(props.createCommonFormStore.getChangedFormFieldsJson());
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <CreateStepNavigation
        navigation={props.navigation}
        title="General info"
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
            <View style={styles.dot} />
            <View style={styles.dot2} />
            <View style={styles.dot2} />
          </View>
          <Text style={styles.title}>Funding</Text>
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
            Funding
          </Text>
          <Text
            style={{
              marginTop: 12,
              marginBottom: 23,
              marginHorizontal: 20,
              textAlign: 'center',
            }}>
            Set the amount you would like to raise. Until you reach this goal
            the common will not be able to spend any of the funds.
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
            label="Funding goal"
            placeholderText="$"
            infoLabel="Required"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            onChangeText={isValid}
            validation={{
              name: CreateCommonForm.FIELD_FUNDING_GOAL,
              formStore: props.createCommonFormStore,
              validateRule: 'required|integer',
            }}
          />
          <View style={{}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>Deadline</Text>
              <Text style={[styles.infoLabel, {alignSelf: 'flex-end'}]}>
                Required
              </Text>
            </View>
            <SegmentedControlTab
              tabsContainerStyle={{marginTop: 16, marginBottom: 40, height: 40}}
              tabStyle={{borderColor: colors.grey4}}
              activeTabStyle={{backgroundColor: colors.mainBlue}}
              values={['1 week', '1 month', pickDate]}
              tabTextStyle={{color: colors.mainBlue}}
              borderRadius={8}
              selectedIndex={segmentedIndex}
              onTabPress={index => setSegmentedIndex(index)}
            />
            <Modal
              isVisible={show}
              avoidKeyboard={true}
              backdropOpacity={0.3}
              onBackdropPress={() => setShow(false)}
              style={styles.view}>
              <View style={{backgroundColor: 'white'}}>
                <View
                  style={{
                    height: 50,
                    backgroundColor: colors.grey4,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity onPress={() => setShow(false)}>
                    <Text
                      style={{
                        color: colors.mainBlue,
                        fontSize: 16,
                        fontWeight: 'bold',
                        paddingHorizontal: 20,
                        textAlign: 'center',
                        alignSelf: 'flex-end',
                      }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={new Date()}
                  minimumDate={new Date()}
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) =>
                    setPickDate(moment(date).format('MMM DD, YYYY'))
                  }
                />
              </View>
            </Modal>
          </View>
          <TextInputField
            value={''}
            viewStyle={{alignSelf: 'stretch'}}
            label="Minimum contrubution"
            infoLabel="Required"
            placeholderText="$"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            onChangeText={isValid}
            validation={{
              name: CreateCommonForm.FIELD_MINIMUM,
              formStore: props.createCommonFormStore,
              validateRule: 'required|integer',
            }}
          />
          <View style={{width: '100%'}}>
            <Text style={styles.readMoreButton}>
              Min. $10. Members can donate more if they want.{' '}
            </Text>
          </View>
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
            Continue to Agenda
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
});

export default inject('createCommonFormStore')(observer(CreateStep2));

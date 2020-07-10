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
import TextInputFieldWithIcon from '../../../Components/FormFields/TextInputFieldWithIcon';
import {colors, font} from '../../../Theme';

import CreateStepHeaderTitle from './CreateStepHeaderTitle';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import SegmentedControlTab from 'react-native-segmented-control-tab';
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import CreateCommonForm from '../../../Components/Forms/CreateCommonForm';
import Modal from 'react-native-modal';
import moment from 'moment';
import CreateStepDotHeader from './CreateStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';

const CreateStep2 = props => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [segmentedIndex, setSegmentedIndex] = useState(0);
  const [pickDate, setPickDate] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 125],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  useEffect(() => {
    const name = CreateCommonForm.DEADLINE;
    props.fundingFormStore.registerFormField(name, 'required');
    switch (segmentedIndex) {
    case 0: {
      props.fundingFormStore.fieldChanged(
        name,
        moment()
          .add('7', 'days')
          .unix(),
      );
      setShow(false);
      break;
    }
    case 1: {
      props.fundingFormStore.fieldChanged(
        name,
        moment()
          .add('1', 'months')
          .unix(),
      );
      setShow(false);
      break;
    }
    case 2: {
      props.fundingFormStore.fieldChanged(
        name,
        moment(pickDate || {}).unix(),
      );
      setShow(true);
      break;
    }
    }
  }, [segmentedIndex, pickDate, props.fundingFormStore]);

  const push = () => {
    if (props.fundingFormStore.isFormValid()) {
      props.navigation.navigate('CreateStep3');
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
      <CreateStepDotHeader
        title="Funding"
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
          <CreateStepHeaderTitle
            title="Funding"
            subtitle="Set a time period to invite members and raise initial funds. You can
            continue raising funds forever."
          />
          <View
            style={{
              backgroundColor: colors.grey4,
              height: 1,
              marginBottom: 40,
            }}
          />
          <View style={{}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>Campaign period</Text>
              <Text style={[styles.infoLabel, {alignSelf: 'flex-end'}]}>
                Required
              </Text>
            </View>
            <Text style={styles.info2}>
              When this period is over, you will be able to create proposals and
              use the funds you raised, even if you don’t reach your funding
              goal.
            </Text>

            <SegmentedControlTab
              tabsContainerStyle={{marginTop: 16, marginBottom: 40, height: 44}}
              tabStyle={{borderColor: colors.grey4}}
              activeTabStyle={{backgroundColor: colors.mainBlue}}
              values={[
                '1 week',
                '1 month',
                pickDate ? moment(pickDate).format('MMM DD, YYYY') : 'Custom',
              ]}
              tabTextStyle={styles.tabTextStyle}
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
                  value={pickDate === null ? new Date() : pickDate}
                  minimumDate={new Date()}
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => setPickDate(date)}
                />
              </View>
            </Modal>
          </View>
          <TextInputFieldWithIcon
            iconName="dollar"
            iconSize={12}
            iconStyle={{paddingRight: 5}}
            iconEmptyColor={colors.grey3}
            iconFillColor={colors.grey}
            viewStyle={{alignSelf: 'stretch'}}
            label="Campaign goal"
            infoLabel="Required"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            validation={{
              name: CreateCommonForm.FUNDING_GOAL,
              formStore: props.fundingFormStore,
              validateRule: 'required|integer|min:100',
            }}
          />
          <TextInputFieldWithIcon
            iconName="dollar"
            iconSize={12}
            iconStyle={{paddingRight: 5}}
            iconEmptyColor={colors.grey3}
            iconFillColor={colors.grey}
            viewStyle={{alignSelf: 'stretch'}}
            label="Minimum joining contribution (min $5)"
            infoLabel="Required"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            validation={{
              name: CreateCommonForm.MINIMUM,
              formStore: props.fundingFormStore,
              validateRule: 'required|integer',
            }}
          />
          <View style={{width: '100%'}}>
            <Text style={styles.readMoreButton}>
              Min. $10. Members can donate more if they want.{' '}
            </Text>
          </View>
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Continue to Agenda"
        pass={props.fundingFormStore.isFormActionEnabled()}
        onPress={push}
      />
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
  tabTextStyle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.mainBlue,
  },
  info2: {
    marginVertical: 5,
    lineHeight: 22,
    ...font.primary.regular,
    color: colors.grey3,
    ...font.fontSize(1),
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
    ...font.primary.regular,
    ...font.fontSize(2),
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
  label: {
    ...font.primary.primary,
    ...font.fontSize(2),
    color: colors.slate,
  },
  infoLabel: {
    ...font.primary.italic,
    ...font.fontSize(2),
    color: colors.paleblue,
    textAlign: 'right',
    flex: 1,
  },
});

export default inject(
  'generalInfoFormStore',
  'fundingFormStore',
  'agendaFormStore',
  'reviewFormStore',
  'daoStore',
)(observer(CreateStep2));

//generalInfoFormStore
//fundingFormStore
//agendaFormStore
//reviewFormStore

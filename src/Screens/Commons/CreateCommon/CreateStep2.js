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
  Platform,
} from 'react-native';
import TextInputFieldWithIcon from '~/Components/FormFields/TextInputFieldWithIcon';
import {colors, font, sizeL, sizeS} from '~/Theme';
import CreateStepHeaderTitle from './CreateStepHeaderTitle';
import {observer, inject} from 'mobx-react';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import CreateStepHeader from './CreateStepHeader';
import CreateStepNavigation from './CreateStepNavigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import CreateCommonForm from '~/Components/Forms/CreateCommonForm';
import Modal from 'react-native-modal';
import moment from 'moment';
import CreateStepDotHeader from './CreateStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
import {object, func, shape} from 'prop-types';
const {width} = Dimensions.get('window');

const CONTRIBUTION_TAB_VALUES = ['one-time', 'monthly'];
const SAFETY_PERIOD_TAB_VALUES = [moment().add('7', 'days').unix(), moment().add('1', 'months').unix()];

const CreateStep2 = ({fundingFormStore, navigation}) => {

  const initialContributionIndex = fundingFormStore.form.fields[CreateCommonForm.CONTRIBUTION]?.value ? CONTRIBUTION_TAB_VALUES.indexOf(fundingFormStore.form.fields[CreateCommonForm.CONTRIBUTION]?.value) : 0;
  const initialSegmentedIndex = fundingFormStore.form.fields[CreateCommonForm.DEADLINE]?.value ? fundingFormStore.form.fields[CreateCommonForm.DEADLINE]?.value.index : 0;

  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [segmentedIndex, setSegmentedIndex] = useState(initialSegmentedIndex);
  const [contributionIndex, setContributionIndex] = useState(initialContributionIndex);
  const [pickDate, setPickDate] = useState(initialSegmentedIndex === 2 ? fundingFormStore.form.fields[CreateCommonForm.DEADLINE]?.value.value : null);
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
    onTabChange(initialSegmentedIndex, true); // pre-select 1 week at first render
    onContributionTabChange(initialContributionIndex); // pre-select
  }, []);

  const onContributionTabChange = (index) => {
    const name = CreateCommonForm.CONTRIBUTION;
    fundingFormStore.registerFormField(name, 'required');

    fundingFormStore.fieldChanged(
      name,
      CONTRIBUTION_TAB_VALUES[index]
    );
    setContributionIndex(index);
  };

  /* useEffect(() => {
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
  }, [segmentedIndex, pickDate, props.fundingFormStore]); */

  const onDatePickerChange = (event, date) => {
    const currDate = moment(date || {}).unix();
    fundingFormStore.fieldChanged(CreateCommonForm.DEADLINE, {value: (currDate), index: 2});
    if (Platform.OS === 'android') {
      setShow(false);
    }
    setPickDate(currDate);
  };

  const onTabChange = (index, isInitialCall) => {
    const name = CreateCommonForm.DEADLINE;
    fundingFormStore.registerFormField(name, 'required');

    if (index === 2 && !isInitialCall) {
      setShow(true);
    } else {
      fundingFormStore.fieldChanged(name, {value: SAFETY_PERIOD_TAB_VALUES[index], index});
      setShow(false);
    }

    setSegmentedIndex(index);
  };

  // iOS only
  const onDone = () => {
    if (pickDate) {
      setShow(false);
    } else {
      fundingFormStore.fieldChanged(
        CreateCommonForm.DEADLINE,
        {value: moment({}).unix(), index: 2}
      );
      setPickDate(moment().toDate());
      setShow(false);
    }
  };

  const push = () => {
    if (fundingFormStore.isFormValid()) {
      navigation.navigate('CreateStep3');
    }
  };

  const DatePicker = <DateTimePicker
    testID="dateTimePicker"
    timeZoneOffsetInMinutes={0}
    value={pickDate ? pickDate : new Date()}
    minimumDate={new Date()}
    maximumDate={moment().add('100', 'days').toDate()}
    is24Hour={true}
    display="default"
    onChange={onDatePickerChange}
  />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <CreateStepNavigation
        navigation={navigation}
        title="General info"
      />
      <CreateStepDotHeader
        title="Funding"
        currentIndex={2}
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
            subtitle="Control how this Common will collect and manage funds."
          />
          <View
            style={{
              backgroundColor: colors.grey4,
              height: 1,
              marginBottom: 40,
            }}
          />
          <Text style={styles.label}>{'Contribution'}</Text>
          <SegmentedControlTab
            tabsContainerStyle={{marginTop: 16, marginBottom: 40, height: 44}}
            tabStyle={{borderColor: colors.grey4}}
            activeTabStyle={{backgroundColor: colors.mainBlue}}
            values={['One-time', 'Monthly']}
            tabTextStyle={styles.tabTextStyle}
            borderRadius={8}
            selectedIndex={contributionIndex}
            onTabPress={onContributionTabChange}
          />
          <TextInputFieldWithIcon
            value={fundingFormStore.getFormField(CreateCommonForm.MINIMUM)?.value}
            iconName="dollar"
            iconSize={12}
            iconStyle={{paddingRight: 5}}
            iconEmptyColor={colors.grey3}
            iconFillColor={colors.grey}
            viewStyle={{alignSelf: 'stretch'}}
            label="Minimum one-time contribution (min. $5)"
            subLabel="Set the minimum amount that new members will have to contribute in order to join this Common."
            infoLabel="Required"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            validation={{
              name: CreateCommonForm.MINIMUM,
              formStore: fundingFormStore,
              validateRule: 'required|integer|min:5|max:1000',
              customErrorMessage: 'The amount must be at least $5 and at most $1000.',
            }}
          />
          <View style={{marginTop: 24}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>Funds safety period</Text>
              <Text style={[styles.infoLabel, {alignSelf: 'flex-end'}]}>
                Required
              </Text>
            </View>
            <Text style={styles.info2}>
              Set a period in which members will not be able to create proposals and allocate the funds. This will allow more members to join and participate in the decision-making process.
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
              onTabPress={onTabChange}
            />
            {Platform.OS === 'ios' ? <Modal
              visible={show}
              transparent={true}
              avoidKeyboard={true}
              backdropOpacity={0.3}
              onBackdropPress={() => setShow(false)}
              style={styles.view}>
              <View style={{backgroundColor: 'white'}}>
                <View
                  style={{
                    height: 50,
                    backgroundColor: colors.grey4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    position: 'relative',
                  }}>
                  {/* <Text
                    style={{
                      color: colors.slate,
                      fontSize: 14,
                      textAlign: 'center',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}>
                    {'Min. 1 week'}
                  </Text> */}
                  <TouchableOpacity onPress={onDone}>
                    <Text
                      style={styles.done}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                {DatePicker}
              </View>
            </Modal> : show && (DatePicker)}
          </View>
          {/* <TextInputFieldWithIcon
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
          /> */}
          {/* <View style={{width: '100%'}}>
            <Text style={styles.readMoreButton}>
              Min. $5. Members can donate more if they want.{' '}
            </Text>
          </View> */}
        </View>
      </ScrollView>
      <RequestStepActionButton
        title="Continue to Additional Info"
        pass={fundingFormStore.isFormActionEnabled()}
        onPress={push}
      />
    </SafeAreaView>
  );
};

CreateStep2.propTypes = {
  fundingFormStore: shape({
    fieldChanged: func,
    registerFormField: func,
    isFormValid: func,
    isFormActionEnabled: func,
  }),
  navigation: object,
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
  done: {
    color: colors.mainBlue,
    ...font.primary.bold,
    ...font.fontSize(3),
    paddingRight: 20,
    textAlign: 'center',
  },
  info2: {
    marginVertical: sizeS,
    lineHeight: sizeL,
    ...font.primary.regular,
    color: colors.greySubtitle,
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
)(observer(CreateStep2));

import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import {colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
import SegmentedControlTab from 'react-native-segmented-control-tab';
const {width} = Dimensions.get('window');

const CreateStep2 = (props) => {
  const [common, setCommon] = useState(false);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      width={width - 48}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
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
          Set the amount you would like to raise. Until you reach this goal the
          common will not be able to spend any of the funds.
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
          infoLabel="required"
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: 'funding',
            formStore: props.completeAccountFormStore,
            validateRule: 'required',
          }}
        />
        <View style={{}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>Deadline</Text>
            <Text style={styles.infoLabel}>required</Text>
          </View>
          <SegmentedControlTab
            tabsContainerStyle={{marginTop: 16, marginBottom: 40, height: 40}}
            tabStyle={{borderColor: colors.grey4}}
            activeTabStyle={{backgroundColor: colors.mainBlue}}
            values={['1 week', '1 month', 'Custom']}
            tabTextStyle={{color: colors.mainBlue}}
            borderRadius={8}
            // selectedIndex={this.state.selectedIndex}
            // onTabPress={this.handleIndexChange}
          />
        </View>
        <TextInputField
          value={''}
          viewStyle={{alignSelf: 'stretch'}}
          label="Minimum join fee"
          placeholderText=""
          autoCapitalize="none"
          autoCorrect={false}
          validation={{
            name: 'minimumFee',
            formStore: props.completeAccountFormStore,
            validateRule: 'required',
          }}
        />
        <View style={{width: '100%'}}>
          <Text style={styles.readMoreButton}>
            Min. $10. Members can donate more if they want.{' '}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  oval: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oval2: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 25,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
  label: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.slate,
    alignSelf: 'flex-start',
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

export default CreateStep2;

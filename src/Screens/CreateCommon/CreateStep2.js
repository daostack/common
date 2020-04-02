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
const {width} = Dimensions.get('window');

const CreateStep2 = props => {
  const [common, setCommon] = useState(false);

  return (
    // <ScrollView
    //   contentContainerStyle={{
    //     width,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //   }}>
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        // padding: 24,
        backgroundColor: 'white',
      }}>
      <Text style={{marginTop: 24, fontWeight: '700', fontSize: 18}}>
        Funding
      </Text>
      <Text style={{marginTop: 12, marginBottom: 23}}>
      Set the amount you would like to raise. Until you reach this goal the common will not be able to spend any of the funds. 
      </Text>
      <TextInputField
        value={''}
        viewStyle={{alignSelf: 'stretch'}}
        label="Funding goal"
        placeholderText="$"
        autoCapitalize="none"
        autoCorrect={false}
        validation={{
          name: 'funding',
          formStore: props.completeAccountFormStore,
          validateRule: 'required',
        }}
      />
      <TextInputField
        value={''}
        viewStyle={{alignSelf: 'stretch'}}
        label="Deadline"
        placeholderText=""
        autoCapitalize="none"
        autoCorrect={false}
        validation={{
          name: 'deadline',
          formStore: props.completeAccountFormStore,
          validateRule: 'required',
        }}
      />
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
          <Text style={styles.readMoreButton}>min. $10. Members can donate more if they want. </Text>
      </View>
    </View>
    // </ScrollView>
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
    color: colors.grey1,
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

export default inject('completeAccountFormStore')(observer(CreateStep2));

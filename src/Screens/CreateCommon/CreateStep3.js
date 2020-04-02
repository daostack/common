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

const CreateStep3 = props => {
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
        // padding: 24,
        backgroundColor: 'white',
      }}>
      <Text style={{marginTop: 24, fontWeight: 'bold', fontSize: 18, textAlign: 'center'}}>
        Agenda
      </Text>
      <Text style={{marginTop: 12, marginBottom: 23}}>
        Describe your cause so people will understand what you want to achieve
        and how
      </Text>
      <TextInputField
        value={''}
        viewStyle={{alignSelf: 'stretch'}}
        label="Course of action"
        placeholderText="What action are you planning to take to fulfil your goal? Are there things this common will not do?"
        autoCapitalize="none"
        autoCorrect={false}
        validation={{
          name: 'action',
          formStore: props.completeAccountFormStore,
          validateRule: 'required',
        }}
      />
      <TextInputField
        value={''}
        viewStyle={{alignSelf: 'stretch'}}
        label="Main Values"
        placeholderText="What should guide members in decision making processes"
        autoCapitalize="none"
        autoCorrect={false}
        validation={{
          name: 'byline',
          formStore: props.completeAccountFormStore,
          validateRule: 'required',
        }}
      />
      <TextInputField
        value={''}
        viewStyle={{height: 400}}
        label="Rules of conduct"
        placeholderText="Any restrictions members should know about (No advertising in common discussion, accepted language)"
        autoCapitalize="none"
        autoCorrect={false}
        validation={{
          name: 'description',
          formStore: props.completeAccountFormStore,
          validateRule: 'required',
        }}
      />
      <View style={{width: '100%'}}>
        <TouchableOpacity>
          <Text style={styles.readMoreButton}>Add Link</Text>
        </TouchableOpacity>
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

export default inject('completeAccountFormStore')(observer(CreateStep3));

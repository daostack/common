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

const CreateStep3 = (props) => {
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
          Describe your cause so people will understand what you want to achieve
          and how
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
          validation={{
            name: 'action',
            formStore: props.completeAccountFormStore,
            validateRule: 'required',
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
            marginVertical: 15,
            fontSize: 12,
            color: colors.grey3,
          }}>
          Any restrictions members should know about (Advertising in common
          discussion, accepted language, you do not talk about Fight Club etc.)
        </Text>
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

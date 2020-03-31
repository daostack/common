import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import TextInputField from '../Components/FormFields/TextInputField';
import {colors} from '../Theme';
import {observer, inject} from 'mobx-react';

const CreateCommon = props => {
  const [common, setCommon] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: 32,
        }}>
        <View style={styles.oval}>
          <Image
            source={require('../Assets/daoGeneralInfo.png')}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
            }}
          />
        </View>
        <View style={styles.oval2}>
          <Image
            source={require('../Assets/funding.png')}
            style={{
              tintColor: 'grey',
              alignItems: 'center',
              justifyContent: 'center',
              width: 16,
              height: 16,
            }}
          />
        </View>
        <View style={styles.oval2}>
          <Image
            source={require('../Assets/agenda.png')}
            style={{
              tintColor: 'grey',
              alignItems: 'center',
              justifyContent: 'center',
              width: 16,
              height: 16,
            }}
          />
        </View>
        <View style={styles.oval2}>
          <Image
            source={require('../Assets/members24.png')}
            style={{
              tintColor: 'grey',
              alignItems: 'center',
              justifyContent: 'center',
              width: 16,
              height: 16,
            }}
          />
        </View>
      </View>
      <Text style={{marginTop: 24, fontWeight: '700', fontSize: 18}}>
        General Info
      </Text>
      <Text style={{marginTop: 12, marginBottom: 23}} >
        Describe your cause so people will understand what you want to achieve
        and how
      </Text>
      <TextInputField
        value={''}
        viewStyle={{alignSelf: 'stretch'}}
        label="Common Name"
        placeholderText=""
        autoCapitalize="none"
        autoCorrect={false}
        validation={{
          name: 'name',
          formStore: props.completeAccountFormStore,
          validateRule: 'required',
        }}
      />
      <TextInputField
        value={''}
        viewStyle={{alignSelf: 'stretch'}}
        label="Byline"
        placeholderText="A sentence that describes what you want to achieve"
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
        viewStyle={{alignSelf: 'stretch'}}
        label="Description"
        placeholderText="Give some more detail about your cause, how are you going to support it, why you are passionate about it and why others should join."
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
      <TouchableOpacity style={styles.continueButton}>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontWeight: '700',
          }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
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

export default inject('completeAccountFormStore')(observer(CreateCommon));

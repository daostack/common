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

const CreateStep1 = props => {
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
        // alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Text style={{marginTop: 24, fontWeight: '700', fontSize: 18, textAlign: 'center'}}>
        General Info
      </Text>
      <Text style={{marginTop: 12, marginBottom: 23, textAlign: 'center'}}>
        Describe your cause so people will understand what you want to achieve
        and how
      </Text>
      <View style={{backgroundColor: colors.grey4, height: 1, width:'100%', marginBottom: 40,}}/>
      <TextInputField
        value={''}
        viewStyle={{alignSelf: 'stretch'}}
        label="Common name"
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
        viewStyle={{height: 400}}
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

export default inject('completeAccountFormStore')(observer(CreateStep1));

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import CreateDiscussionForm from '../../Components/Forms/CreateDiscussionForm';

const DiscussionPost = props => {
  const commonId = props.route.params.commonId;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 60}}>
        <View style={{backgroundColor: colors.white, flex: 1, padding: 20}}>
          <CreateDiscussionForm
            commonId={commonId}
            onFormSubmit={() => {
              props.navigation.pop();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey4,
    borderRadius: 8,
    marginHorizontal: 25,
    marginVertical: 10,
    padding: 10,
  },
});

export default DiscussionPost;

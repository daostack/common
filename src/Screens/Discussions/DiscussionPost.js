import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {colors} from '../../Theme';
import CreateDiscussionForm from '../../Components/Forms/CreateDiscussionForm';

const DiscussionPost = props => {
  const commonId = props.route.params.commonId;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 60}}>
        <View style={{backgroundColor: colors.white, flex: 1, padding: 20}}>
          <CreateDiscussionForm
            commonId={commonId}
            navigation={props.navigation}
            onFormSubmit={() => {
              props.navigation.pop();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiscussionPost;

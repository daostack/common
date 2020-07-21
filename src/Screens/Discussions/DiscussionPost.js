import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {colors} from '../../Theme';
import CreateDiscussionForm from '../../Components/Forms/CreateDiscussionForm';

const DiscussionPost = props => {
  const commonId = props.route.params.commonId;
  return (
    <SafeAreaView style={styles.container}>
      <CreateDiscussionForm
        commonId={commonId}
        navigation={props.navigation}
        onFormSubmit={() => {
          props.navigation.pop();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default DiscussionPost;

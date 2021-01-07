import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {colors} from '~/Theme';
import CreateDiscussionForm from '~/Components/Forms/CreateDiscussionForm';
import {string, object, shape} from 'prop-types';

const DiscussionPost = ({
  navigation,
  route: {
    params: {commonId},
  },
}) => (
  <SafeAreaView style={styles.container}>
    <CreateDiscussionForm
      commonId={commonId}
      navigation={navigation}
      onFormSubmit={() => {
        navigation.pop();
      }}
    />
  </SafeAreaView>
);

DiscussionPost.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      commonId: string,
    }),
  }),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default DiscussionPost;

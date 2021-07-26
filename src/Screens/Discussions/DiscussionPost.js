import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {colors} from '~/Theme';
import {inject, observer} from 'mobx-react';
import CreateDiscussionForm from '~/Components/Forms/CreateDiscussionForm';
import {string, object, shape} from 'prop-types';
import {rootStorePropTypes} from '~/Types/propTypes';

const DiscussionPost = ({
  navigation,
  route: {
    params: {commonId},
  },
  rootStore,
}) => (
  <SafeAreaView style={styles.container}>
    <CreateDiscussionForm
      rootStore={rootStore}
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
  rootStore: rootStorePropTypes,
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

export default inject('rootStore')(observer(DiscussionPost));

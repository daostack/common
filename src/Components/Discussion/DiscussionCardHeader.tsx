import React from 'react';
import {StyleSheet, View} from 'react-native';
import {layout, colors, sizeXS} from '~/Theme';
import {observer} from 'mobx-react';
import {Reported} from '../../Components/Moderation/Reported';
import {bool, object, InferProps} from 'prop-types';

const props = {
  isReported: bool,
  moderation: object,
  reporter: object,
};

const DiscussionCardHeader: React.FC<InferProps<typeof props>> = ({
  isReported,
  moderation,
  reporter,
}) => (
  <View style={styles.discussionCardHeader}>
    {isReported && moderation && (
      <Reported moderation={moderation} reporter={reporter} />
    )}
  </View>
);

DiscussionCardHeader.propTypes = props;

const styles = StyleSheet.create({
  // Proposal Card Header style
  discussionCardHeader: {
    ...layout.content,
    ...layout.flexRow,
    alignSelf: 'stretch',
    backgroundColor: colors.paleblue,
    padding: sizeXS,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 30,
  },
});

export default observer(DiscussionCardHeader);

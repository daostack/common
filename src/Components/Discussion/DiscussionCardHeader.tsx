import React from 'react';
import {StyleSheet, View} from 'react-native';
import {layout, colors, sizeXS, sizeM} from '~/Theme';
import {observer} from 'mobx-react';
import {Reported} from '../../Components/Moderation/Reported';
import {bool, object, InferProps, shape, string} from 'prop-types';
import Icon from '~/Assets/iconfont/Icon';

const props = {
  isReported: bool,
  moderation: object,
  reporter: object,
  hasPermission: bool,
  authInfo: shape({
    uid: string,
  }).isRequired,
};

const DiscussionCardHeader: React.FC<InferProps<typeof props>> = ({
  isReported,
  moderation,
  reporter,
  hasPermission,
  authInfo,
}) => {
  const showIcon = moderation?.flag === 'hidden' && !hasPermission;

  return (
    <View
      style={showIcon ? styles.hiddenCardHeader : styles.discussionCardHeader}>
      {isReported && moderation && (
        <Reported
          moderation={moderation}
          reporter={reporter}
          currentUID={authInfo.uid}
        />
      )}
      {showIcon && (
        <Icon
          name="questionMark"
          size={16}
          style={{padding: 10}}
          color={colors.blueGray1}
        />
      )}
    </View>
  );
};

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
  hiddenCardHeader: {
    ...layout.flexRow,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blueGray,
    //padding: sizeXS,
    paddingHorizontal: sizeM,
    borderRadius: 5,
    height: 35,
  },
});

export default observer(DiscussionCardHeader);

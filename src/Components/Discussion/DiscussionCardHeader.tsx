import React from 'react';
import {StyleSheet, View} from 'react-native';
import {layout, colors, sizeXS, sizeM} from '~/Theme';
import {observer} from 'mobx-react';
import {Reported} from '~/Components/Moderation/Reported';
import Icon from '~/Assets/iconfont/Icon';
import {FLAGS} from '~/Components/Moderation/constants';
import {PERMISSIONS} from '~/Types';
import {Common, Discussion} from '~/Stores/Models';

export const DiscussionCardHeader: React.FC<{
  discussion: Discussion;
  common: Common;
}> = observer(({discussion, common}) => {
  const ownersPermission = common.getPermission(discussion.ownerId);
  const viewerPermission = common.getPermission();
  const showIcon =
    (discussion.moderation?.flag === FLAGS.hidden && !ownersPermission) ||
    viewerPermission === PERMISSIONS.MODERATOR;

  return (
    <View
      style={showIcon ? styles.hiddenCardHeader : styles.discussionCardHeader}>
      {discussion.isReported && moderation && (
        <Reported
          moderation={moderation}
          reporter={reporter}
          viewerPermission={viewerPermission}
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
});

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

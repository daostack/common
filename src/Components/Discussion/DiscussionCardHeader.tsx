import React from 'react';
import {StyleSheet, View} from 'react-native';
import {layout, colors, sizeXS, sizeM} from '~/Theme';
import {observer, inject} from 'mobx-react';
import {Reported} from '../../Components/Moderation/Reported';
import {bool, object, InferProps, string} from 'prop-types';
import Icon from '~/Assets/iconfont/Icon';
import {FLAGS, ENTITY_TYPES} from '../../Components/Moderation/constants';
import {rootStorePropTypes} from '~/Types/propTypes';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';

const props = {
  isReported: bool,
  moderation: object,
  reporter: object,
  hasPermission: string,
  rootStore: rootStorePropTypes.isRequired,
  viewerPermission: string,
  showCard: bool,
};

const DiscussionCardHeader: React.FC<InferProps<typeof props>> = ({
  isReported,
  moderation,
  reporter,
  hasPermission,
  rootStore,
  viewerPermission,
  showCard,
}) => {
  const authStore = rootStore.authStore;
  const showIcon =
    (moderation?.flag === FLAGS.hidden && !hasPermission) ||
    viewerPermission === PERMISSIONS.MODERATOR;

  return (
    <View
      style={showIcon ? styles.hiddenCardHeader : styles.discussionCardHeader}>
      {isReported && moderation && (
        <Reported
          moderation={{...moderation, type: ENTITY_TYPES.discussion}}
          reporter={reporter}
          currentUID={authStore?.userInfo?.uid}
          viewerPermission={viewerPermission as string}
          showCard={!!showCard}
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
  },
  hiddenCardHeader: {
    ...layout.flexRow,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: colors.blueGray,
    //padding: sizeXS,
    paddingHorizontal: sizeM,
    borderRadius: 5,
    minHeight: 35,
  },
});

export default inject('rootStore')(observer(DiscussionCardHeader));

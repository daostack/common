import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {dateFormat} from '~/Components/Moderation/helper';
import {Common} from '~/Stores/Models/Common';
import {colors, font, layout} from '~/Theme';
import {BottomGradient} from '~/Util/BottomGradient';
import {useNavigation} from '@react-navigation/native';
import {useStore} from '~/Util/hooks/useStore';
import {PROPOSAL_STAGE, PROPOSAL_TYPE} from '~/Config';
import {screenWidth} from '~/Util/dimensions';
import Icon from '~/Assets/iconfont/Icon';

interface CommonTopTitlesProps {
  common: Common;
  hasPermission: string;
  isMember: boolean;
}

export const CommonTopTitles = ({
  common,
  hasPermission,
  isMember,
}: CommonTopTitlesProps) => {
  const navigation = useNavigation();
  const proposalStore = useStore('proposalStore');
  const commonStore = useStore('commonStore');
  const name = common?.name;
  const byline = common?.metadata.byline;
  const updatedAt = common?.updatedAt;
  const activeDate = dateFormat(updatedAt);
  // to do - private common
  const isCommonPrivate = false;
  const pendingCount = proposalStore.getCommonProposals(common.id, {
    stage: PROPOSAL_STAGE.Active,
    type: PROPOSAL_TYPE.Join,
  }).length;
  const membersCount = commonStore.getCommonById(common.id)?.members.length;

  const onMembersPress = () => {
    navigation.navigate('CommonMembers', {
      commonId: common.id,
      screenTitle: common.name,
      hasPermission,
      showHiddenNote: () => {},
      isMember,
    });
  };

  return (
    <View style={styles.headerContainer}>
      {isCommonPrivate && (
        <Icon name="lock" size={18} color={colors.white} style={styles.lock} />
      )}
      <Text style={styles.time}>Active {activeDate} ago</Text>
      <Text style={styles.headerTitleWhite} numberOfLines={5}>
        {name}
      </Text>
      <Text style={styles.byline} numberOfLines={5}>
        {byline}
      </Text>
      <TouchableOpacity
        onPress={onMembersPress}
        containerStyle={styles.bottomBtn}>
        <Text style={styles.bottomText}>
          {membersCount} Members{'  '}
          <Text style={styles.pending}>{pendingCount} Pending </Text>
          <Icon name="right-arrow" size={16} color={colors.white} />
        </Text>
      </TouchableOpacity>
      <BottomGradient />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    ...layout.content,
    alignSelf: 'stretch',
    flexGrow: 1,
    height: 250,
    padding: 0,
    marginTop: 10,
  },
  headerTitleWhite: {
    ...font.fontSize(5),
    ...font.heading.bold,
    color: colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 4,
  },
  byline: {
    ...font.primary.regular,
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    zIndex: 99,
    marginTop: 3,
    width: screenWidth * 0.55,
  },
  time: {
    bottom: 8,
    ...font.primary.regular,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    color: colors.white2,
    alignSelf: 'center',
  },
  bottomBtn: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    bottom: 15,
    zIndex: 99,
  },
  bottomText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    ...font.primary.regular,
    fontWeight: '700',
  },
  pending: {
    fontWeight: '400',
  },
  lock: {
    top: -25,
  },
});

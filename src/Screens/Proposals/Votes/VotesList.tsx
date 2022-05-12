import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import moment from 'moment';
import React, {useCallback} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import MemberImage from '~/Components/Commons/MemberImage';
import {VoteWithUserInfo} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {UserModel} from '~/Stores/Models/UserModel';
import {colors, font, layout, sizeS, text} from '~/Theme';
import {VOTE_ICON_BY_STATUSES, VOTE_STATUSES} from '~/Util/constants/votes';
import {useStore} from '~/Util/hooks/useStore';

interface Props {
  proposalId: string;
  voteType: VOTE_STATUSES | 'all';
}

export const VotesList = observer(({proposalId, voteType}: Props) => {
  const {proposalStore, userStore} = useStore('rootStore');

  const proposalInfo = proposalStore.getProposalById(proposalId);
  const votes = proposalInfo?.votes;
  const votesUsers = userStore.getUsersVotesByType(votes, voteType);

  const navigation = useNavigation();

  const showUserProfile = (userInfo: UserModel) => {
    navigation.navigate('Profile', {
      userId: userInfo.uid,
      userInfo,
    });
  };

  const renderVoteCard = useCallback(
    ({item, index}: {index: null; item: VoteWithUserInfo}) => (
      <View style={{...styles.cardContainer}}>
        <TouchableOpacity
          onPress={() => showUserProfile(item.user)}
          key={`touch_${index}`}>
          <MemberImage userInfo={item.user} />
        </TouchableOpacity>
        <View style={styles.userInfoContainer}>
          <Text style={styles.displayName}>
            {item.user?.displayName || 'Unknown user'}
          </Text>
          {item.updatedAt && (
            <Text style={styles.voteUpdatedTime}>
              {moment.unix(item.updatedAt.seconds).fromNow()}
            </Text>
          )}
        </View>
        <Icon
          name={VOTE_ICON_BY_STATUSES[item.voteOutcome]}
          size={32}
          style={layout.marginRightXS}
        />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((data) => data.voteId, []);

  return (
    <FlatList
      maxToRenderPerBatch={5}
      initialNumToRender={5}
      listKey="VotesList"
      data={votesUsers}
      keyExtractor={keyExtractor}
      renderItem={renderVoteCard}
    />
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    ...layout.content,
    ...layout.flexRow,
    flex: 1,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.grey4,
    padding: 18,
  },
  userInfoContainer: {
    ...layout.content,
    ...layout.flexStart,
    alignContent: 'flex-start',
    flex: 1,
    flexWrap: 'wrap',
  },
  voteUpdatedTime: {
    ...text.runninglightGray,
    width: '100%',
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  item: {
    paddingHorizontal: sizeS,
    borderBottomColor: colors.grey4,
    borderBottomWidth: 1,
  },
  displayName: {
    ...font.primary.regular,
    ...font.fontSize(2),
    flexWrap: 'wrap',
    fontWeight: '500',
    fontSize: 16,
  },
});

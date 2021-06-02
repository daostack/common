import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import moment from 'moment';
import {layout, colors, text, font} from '~/Theme';
import FastImage from 'react-native-fast-image';
import {inject, observer} from 'mobx-react';
import Icon from '~/Assets/iconfont/Icon';
import {IProposalVote} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import RootStore from '~/Stores/RootStore';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';

type Props = {
  proposalVote: IProposalVote;
  commonId: string;
  rootStore?: RootStore;
};

const ProposalVoteCard: FC<Props> = ({proposalVote, rootStore, commonId}) => {
  const userStore = rootStore!.userStore;
  const voteStore = rootStore!.voteStore;
  const user = userStore.getUserById(proposalVote.voterId);
  const vote = voteStore.getVoteById(proposalVote.voteId);

  if (!user || !vote) {
    return null;
  }

  const viewerPermission = rootStore!.authStore.getPermission(
    commonId,
    user.id,
  );

  const isModerator = viewerPermission === PERMISSIONS.MODERATOR;

  return (
    <View style={styles.cardContainer}>
      <FastImage style={styles.userImage} source={{uri: user.photoURL}} />
      <View style={styles.messageContainer}>
        {isModerator && <Text style={text.moderatorText}>Moderator</Text>}
        <Text style={styles.nameStyle}>{user.displayName}</Text>
        <Text style={styles.timeStyle}>
          {moment.unix(vote.createdAt.seconds).fromNow()}
        </Text>
      </View>
      <View>
        {proposalVote.voteOutcome === 'approved' ? (
          <Icon name="user-approved" color={colors.lightishGreen} size={25} />
        ) : (
          <Icon name="user-rejected" color={colors.against} size={25} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
    marginRight: 15,
  },
  cardContainer: {
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomColor: colors.paleLilacTwo,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  messageContainer: {
    flex: 1,
  },
  nameStyle: {
    ...font.primary.bold,
    ...font.fontSize(2),
    color: colors.black,
    textAlign: 'left',
  },
  messageStyle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
    ...layout.marginTopS,
  },
  timeStyle: {
    ...text.textFieldplaceholder,
    ...font.fontSize(0),
  },
});

export default inject('rootStore')(observer(ProposalVoteCard));

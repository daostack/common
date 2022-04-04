import React, {ReactElement} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font, layout} from '~/Theme';
import {
  VOTE_COLORS_BY_STATUSES,
  VOTE_ICON_BY_STATUSES,
  VOTE_STATUSES,
} from '~/Util/constants/votes';

interface Props {
  onVote: (voteType: VOTE_STATUSES) => void;
  voteOutcome: VOTE_STATUSES;
  onPressClose: () => void;
  currentUserPhotoUrl: string;
  votingProcessState: {
    inProgress: boolean;
    error: boolean;
  };
}

export const ModalChangeVote = ({
  onVote,
  voteOutcome,
  currentUserPhotoUrl,
  votingProcessState,
}: Props): ReactElement => (
  <SafeAreaView
    style={{
      ...styles.body,
      height: 350,
    }}>
    <View style={styles.plug} />
    <View style={styles.content}>
      <View style={styles.imageContainer}>
        <Image
          style={[
            styles.userImage,
            {borderColor: VOTE_COLORS_BY_STATUSES[voteOutcome]},
          ]}
          source={{uri: currentUserPhotoUrl}}
          width={70}
          height={70}
        />
      </View>
      <Text style={styles.title}>Change your vote</Text>

      <View style={styles.btnsContainer}>
        {!votingProcessState.inProgress ? (
          <>
            <TouchableOpacity
              onPress={() => onVote(VOTE_STATUSES.APPROVED)}
              style={[
                styles.voteBtn,
                {
                  ...(voteOutcome === VOTE_STATUSES.APPROVED && {
                    backgroundColor: VOTE_COLORS_BY_STATUSES[voteOutcome],
                  }),
                },
              ]}>
              <Icon
                name={VOTE_ICON_BY_STATUSES.approved}
                size={24}
                color={
                  voteOutcome === VOTE_STATUSES.APPROVED
                    ? colors.white
                    : VOTE_COLORS_BY_STATUSES.approved
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onVote(VOTE_STATUSES.ABSTAINED)}
              style={[
                styles.voteBtn,
                {
                  ...(voteOutcome === VOTE_STATUSES.ABSTAINED && {
                    backgroundColor: VOTE_COLORS_BY_STATUSES[voteOutcome],
                  }),
                },
              ]}>
              <Icon
                name={VOTE_ICON_BY_STATUSES.abstained}
                size={24}
                color={
                  voteOutcome === VOTE_STATUSES.ABSTAINED
                    ? colors.white
                    : VOTE_COLORS_BY_STATUSES.abstained
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onVote(VOTE_STATUSES.REJECTED)}
              style={[
                styles.voteBtn,
                {
                  ...(voteOutcome === VOTE_STATUSES.REJECTED && {
                    backgroundColor: VOTE_COLORS_BY_STATUSES[voteOutcome],
                  }),
                },
              ]}>
              <Icon
                name={VOTE_ICON_BY_STATUSES.rejected}
                size={24}
                color={
                  voteOutcome === VOTE_STATUSES.REJECTED
                    ? colors.white
                    : VOTE_COLORS_BY_STATUSES.rejected
                }
              />
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={[
              styles.loading,
              {
                borderColor: VOTE_COLORS_BY_STATUSES[voteOutcome],
              },
            ]}>
            <ActivityIndicator color={colors.white} />
          </View>
        )}
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  body: {
    height: 200,
    ...layout.content,
    ...layout.flexStart,
    paddingTop: 0,
    alignItems: 'center',
    width: '100%',
  },
  background: {
    width: '100%',
  },
  voteBtn: {
    height: 48,
    width: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.grey4,
    borderWidth: 1,
    shadowColor: 'rgba(0, 26, 54, 0.08)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 4,
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 26,
  },
  content: {
    marginHorizontal: 24,
    width: '100%',
  },
  imageContainer: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    marginBottom: 26,
  },
  imageApprove: {
    height: 70,
    width: 70,
    borderWidth: 6,
    borderRadius: 70,
    borderColor: colors.lightishGreen,
    alignSelf: 'center',
  },
  userImage: {
    height: 70,
    width: 70,
    borderWidth: 6,
    borderRadius: 70,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    alignSelf: 'center',
    color: colors.black,
    marginBottom: 7,
    ...font.primary.bold,
  },
  subTitle: {
    fontSize: 16,
    alignSelf: 'center',
    marginBottom: 24,
    ...font.primary.regular,
  },
  btnActionText: {
    color: colors.white,
    fontSize: 16,
    ...font.primary.regular,
  },
  btnCancelText: {
    fontSize: 16,
    ...font.primary.regular,
  },
  btnApprove: {
    backgroundColor: colors.lightishGreen,
    marginBottom: 16,
  },
  btnReject: {
    backgroundColor: colors.pinkishOrange,
    marginBottom: 16,
  },
  cancelBtn: {
    marginBottom: 40,
  },
  iconStyle: {
    height: 116,
    width: 116,
    position: 'absolute',
    alignSelf: 'center',
    left: 41,
    bottom: -8,
  },
  btnApproveIcon: {},
  btnRejectIcon: {},
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  loading: {
    marginTop: 47,
    height: 48,
    width: 48,
    alignSelf: 'center',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

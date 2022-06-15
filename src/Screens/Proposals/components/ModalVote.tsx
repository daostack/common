import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {colors, font, layout} from '~/Theme';
import {
  VOTE_COLORS_BY_STATUSES,
  VOTE_MODAL_INFO,
  VOTE_STATUSES,
} from '~/Util/constants/votes';

interface Props {
  voteType: VOTE_STATUSES;
  onVote: (voteType: VOTE_STATUSES) => void;
  onPressClose: () => void;
  currentUserPhotoUrl: string;
  votingProcessState: {
    inProgress: boolean;
    error: boolean;
  };
  isMember: boolean;
}

export const ModalVote = ({
  onVote,
  voteType,
  onPressClose,
  currentUserPhotoUrl,
  votingProcessState,
  isMember,
}: Props) => {
  if (!isMember) {
    return (
      <SafeAreaView
        style={{
          ...styles.body,
          height: 250,
        }}>
        <View style={styles.plug} />
        <View style={styles.content}>
          <Text style={styles.title}>Only members can vote</Text>
          <Text style={[styles.subTitle, {textAlign: 'center'}]}>
            This proposal is ending soon - non-members {'\n'}cannot vote
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
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
              styles.image,
              {
                borderColor: VOTE_COLORS_BY_STATUSES[voteType],
              },
            ]}
            source={{uri: currentUserPhotoUrl}}
            width={70}
            height={70}
          />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: VOTE_COLORS_BY_STATUSES[voteType],
              borderColor: VOTE_COLORS_BY_STATUSES[voteType],
            },
          ]}>
          {VOTE_MODAL_INFO[voteType]?.title}
        </Text>
        {!votingProcessState.inProgress ? (
          <>
            <Text style={styles.subTitle}>
              {VOTE_MODAL_INFO[voteType]?.subtitle}
            </Text>
            <TouchableOpacity
              style={{
                ...layout.btnAction,
                ...styles.btnAction,
                ...layout.marginRightS,
                backgroundColor: VOTE_COLORS_BY_STATUSES[voteType],
              }}
              onPress={() => onVote(voteType)}>
              <Text style={styles.btnActionText}>
                {VOTE_MODAL_INFO[voteType]?.btnMessage}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={[
              styles.loading,
              {
                backgroundColor: VOTE_COLORS_BY_STATUSES[voteType],
              },
            ]}>
            <ActivityIndicator color={colors.white} />
          </View>
        )}
        {!votingProcessState.inProgress && (
          <TouchableOpacity
            style={{
              ...layout.btnOutline,
              ...styles.cancelBtn,
              ...layout.marginRightS,
            }}
            onPress={onPressClose}>
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    height: 200,
    ...layout.content,
    ...layout.flexStart,
    paddingTop: 0,
    alignItems: 'center',
    width: '100%',
  },
  plug: {
    backgroundColor: colors.grey4,
    width: 72,
    height: 6,
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
  image: {
    height: 70,
    width: 70,
    borderWidth: 5,
    borderRadius: 70,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
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
  btnAction: {
    marginBottom: 16,
    height: 48,
  },
  cancelBtn: {
    marginBottom: 40,
    height: 48,
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

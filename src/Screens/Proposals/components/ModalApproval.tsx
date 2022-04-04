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

interface Props {
  voteType: boolean;
  onVote: (voteType: boolean) => void;
  onPressClose: () => void;
  сurrentUserPhotoUrl: string;
  votingProcessState: {
    inProgress: boolean;
    error: boolean;
  };
}

export const ModalApproval = ({
  onVote,
  voteType,
  onPressClose,
  сurrentUserPhotoUrl,
  votingProcessState,
}: Props) => {
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
              voteType ? styles.approveColor : styles.rejectColor,
            ]}
            source={{uri: сurrentUserPhotoUrl}}
            width={70}
            height={70}
          />
        </View>
        {voteType ? (
          <>
            <Text style={[styles.title, styles.approveColor]}>Approve</Text>
            {!votingProcessState.inProgress ? (
              <>
                <Text style={styles.subTitle}>
                  Vote to approve this proposal
                </Text>
                <TouchableOpacity
                  style={{
                    ...styles.btnAction,
                    ...styles.approveBackground,
                    ...layout.btnAction,
                    ...layout.marginRightS,
                  }}
                  onPress={() => onVote(voteType)}>
                  <Text style={styles.btnActionText}>Vote to approve</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={[styles.loading, styles.approveBackground]}>
                <ActivityIndicator color={colors.white} />
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={[styles.title, styles.rejectColor]}>Reject</Text>
            {!votingProcessState.inProgress ? (
              <>
                <Text style={styles.subTitle}>
                  Vote to reject this proposal
                </Text>
                <TouchableOpacity
                  style={{
                    ...styles.btnAction,
                    ...styles.rejectBackground,
                    ...layout.btnAction,
                    ...layout.marginRightS,
                  }}
                  onPress={() => onVote(voteType)}>
                  <Text style={styles.btnActionText}>Vote to reject</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={[styles.loading, styles.rejectBackground]}>
                <ActivityIndicator color={colors.white} />
              </View>
            )}
          </>
        )}
        {!votingProcessState.inProgress && (
          <TouchableOpacity
            style={{
              ...styles.cancelBtn,
              ...layout.btnOutline,
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
  background: {
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
  loading: {
    marginTop: 47,
    height: 48,
    width: 48,
    alignSelf: 'center',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBackground: {
    backgroundColor: colors.pinkishOrange,
  },
  rejectColor: {
    color: colors.pinkishOrange,
    borderColor: colors.pinkishOrange,
  },
  approveBackground: {
    backgroundColor: colors.lightishGreen,
  },
  approveColor: {
    color: colors.lightishGreen,
    borderColor: colors.lightishGreen,
  },
});

import React from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font, layout} from '~/Theme';

interface Props {
  commonId: string;
  limit: number;
  voteType: boolean;
  onVote: (voteType: boolean) => void;
  onPressClose: () => void;
  сurrentUserPhotoUrl: string;
}

export const ModalApproval = ({onVote, voteType, onPressClose, сurrentUserPhotoUrl}: Props) => (
  <SafeAreaView style={{
    ...styles.body,
    height: 350,
  }}>
    <View style={styles.plug} />
    <View style={styles.content}>
      <View style={styles.imageContainer}>
        <Image
          style={voteType ? styles.imageApprove : styles.imageReject}
          source={{uri: сurrentUserPhotoUrl}}
          width={70}
          height={70}
        />
        <Icon name={voteType ? 'iconVotingApproved' : 'iconVotingRejected'} strokeWidth={3} size={40} style={styles.iconStyle} />
      </View>
      { voteType ?
        <Text style={styles.titleApprove}>Approve</Text>
        :
        <Text style={styles.titleReject}>Reject</Text>
      }
      { voteType ?
        <Text style={styles.subTitle}>Vote to approve this proposal</Text>
        :
        <Text style={styles.subTitle}>Vote to reject this proposal</Text>
      }
      {voteType ?
        <TouchableOpacity
          style={{
            ...styles.btnApprove,
            ...layout.btnAction,
            ...layout.marginRightS,
          }}
          onPress={() => onVote(voteType)}>
          <Text style={styles.btnActionText}>Vote to approve</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity
          style={{
            ...styles.btnReject,
            ...layout.btnAction,
            ...layout.marginRightS,
          }}
          onPress={() => onVote(voteType)}>
          <Text style={styles.btnActionText}>Vote to reject</Text>
        </TouchableOpacity>
      }
      <TouchableOpacity
        style={{
          ...styles.cancelBtn,
          ...layout.btnOutline,
          ...layout.marginRightS,
        }}
        onPress={onPressClose}>
        <Text style={styles.btnCancelText}>Cancel</Text>
      </TouchableOpacity>
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
    imageReject: {
      height: 70,
      width: 70,
      borderWidth: 6,
      borderRadius: 70,
      borderColor: colors.pinkishOrange,
      alignSelf: 'center',
    },
    titleApprove: {
      fontSize: 20,
      alignSelf: 'center',
      color: colors.lightishGreen,
      marginBottom: 7,
      ...font.primary.bold,
    },
    titleReject: {
      fontSize: 20,
      alignSelf: 'center',
      color: colors.pinkishOrange,
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
  });


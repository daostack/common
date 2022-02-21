import {useNavigation} from '@react-navigation/native';
import React, {ReactElement} from 'react';
import {CommonActions} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font, layout, text} from '~/Theme';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

type Props = {
  onPressClose: () => void;
  proposalId: string;
  commonId: string;
};

export const UploadInvoicesSuccess = ({
  commonId,
  proposalId,
  onPressClose,
}: Props): ReactElement => {
  const navigation = useNavigation();

  function openProposal(): void {
    onPressClose();
    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          {
            name: NAVIGATION_SCREENS.COMMON_HOME,
          },
          {
            name: NAVIGATION_SCREENS.COMMON_PROFILE,
            params: {commonId},
          },
          {
            name: NAVIGATION_SCREENS.PROPOSAL_SCREEN,
            params: {proposalId},
          },
        ],
      }),
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Icon name="approved-24" size={60} style={styles.approvedLogo} />
        <Text style={styles.title}>Invoices uploaded successfully!</Text>
        <Text style={styles.hint}>
          You will be notified via email after your invoices will be reviewed
        </Text>
      </View>

      <TouchableOpacity
        style={{...layout.btnPrimary, ...styles.doneBtn}}
        onPress={openProposal}>
        <Text style={text.buttoncenterwhite}>Done</Text>
      </TouchableOpacity>
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  approvedLogo: {
    marginTop: 62,
    marginBottom: 62,
  },
  title: {
    textAlign: 'center',
    ...font.primary.bold,
    ...font.fontSize(6),
    color: colors.black,
    lineHeight: 32,
  },
  hint: {
    marginTop: 8,
    textAlign: 'center',
    ...font.primary.bold,
    ...font.fontSize(3),
    color: colors.black,
    lineHeight: 26,
  },
  doneBtn: {
    marginTop: 130,
    marginBottom: 40,
  },
});

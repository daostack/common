import React, {ReactElement} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {font, layout, text} from '~/Theme';
import BottomSheetModal from '~/Components/BottomSheetModal';
import FastImage from 'react-native-fast-image';
import ProposalInfo from '../Proposals/ProposalInfo';

type Props = {
  isVisible: boolean;
  onPressClose: () => void;
  proposalInfo: object;
};

const ModalProposalRejected = ({
  isVisible,
  onPressClose,
  proposalInfo,
}: Props): ReactElement => (
  <BottomSheetModal
    isVisible={isVisible}
    onClose={onPressClose}
    style={layout.bottomSheetRadius}>
    <View style={styles.container}>
      <FastImage
        source={require('~/Assets/rejectedProposalHeader.png')}
        style={{width: 100, height: 100}}
      />
      <Text style={styles.title}>Oh! Your Proposal Was Declined</Text>

      <ProposalInfo proposalInfo={proposalInfo} />

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={{
            ...layout.btnPrimary,
            ...layout.marginTopL,
            ...layout.marginRightS,
          }}
          onPress={onPressClose}>
          <Text style={styles.doneBtn}>{'Done'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </BottomSheetModal>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 50,
    textAlign: 'center',
    ...font.primary.bold,
    ...font.fontSize(4),
  },
  btnContainer: {
    flexDirection: 'row',
    ...layout.marginBottomXL,
  },
  doneBtn: {
    ...text.buttoncenterwhite,
  },
});

export default ModalProposalRejected;

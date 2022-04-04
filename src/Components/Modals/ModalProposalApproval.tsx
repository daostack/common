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

const ModalProposalApproval = ({
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
        source={require('~/Assets/confetti.png')}
        style={{width: '80%', height: 290, margin: 10}}
      />
      <Text style={styles.title}>YAY! Your proposal Is Approved</Text>

      <ProposalInfo proposalInfo={proposalInfo} />

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={{
            ...layout.btnPrimary,
            ...layout.marginTopL,
            ...layout.marginRightS,
          }}
          onPress={onPressClose}>
          <Text style={styles.doneBtn}>{'Let’s get to work'}</Text>
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

export default ModalProposalApproval;

import {View, StyleSheet, StatusBar, SafeAreaView} from 'react-native';

import React, {useRef} from 'react';
import {text, colors, layout, sizeS} from '../../Theme';
import ProposalScreen from '../Proposals/ProposalScreen';

import BoostedInfo from '../BottomSheetScreens/BoostedInfo';
import BottomSheetContainer from '../../Components/BottomSheetContainer';

const ProposalSheetScreen = ({}) => {
  boostedInfoRef = useRef();

  const openBoostedInfoBottomSheet = () => {
    console.log('openBoostedInfo');
    boostedInfoRef.current.snapTo(1);
    boostedInfoRef.current.snapTo(1);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <ProposalScreen openBoostedInfo={openBoostedInfoBottomSheet} />
        </View>
      </SafeAreaView>

      <BottomSheetContainer ref={boostedInfoRef} topSnapPoint={620}>
        <BoostedInfo />
      </BottomSheetContainer>
    </>
  );
};

const styles = StyleSheet.create({
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
  body: {
    backgroundColor: colors.white,
    position: 'relative',
  },
  componentContainer: {
    marginBottom: 100,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },

  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'flex-start',
  },
});

export default ProposalSheetScreen;

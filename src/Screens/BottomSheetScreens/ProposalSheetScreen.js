import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native';

import React from 'react';
import {text, colors, layout, sizeS} from '../../Theme';
import ProposalScreen from '../Proposals/ProposalScreen';

const ProposalSheetScreen = ({navigation}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <ProposalScreen />
        </View>
      </SafeAreaView>

      <SafeAreaView style={{backgroundColor: colors.white}}></SafeAreaView>
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

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
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

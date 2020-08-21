import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import React from 'react';
import { text, layout, colors } from '../../Theme';

const CommonOperationalStateNotif = ({ navigation, onCreateFundingProposal }) => {
  const createFundingProposal = (e) => {
    if (onCreateFundingProposal) {
      onCreateFundingProposal();
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
      vertical
      nestedScrollEnabled
      directionalLockEnabled
    >
      <View style={styles.body}>
        <Image
          style={styles.image}
          source={require('../../Assets/save.png')}
        />
        <Text style={{ ...text.h2Black, ...layout.marginTopXL }}>
          This common is now operational
        </Text>
        <Text
          style={{ ...text.blackText, ...text.centered, ...layout.marginTopS }}
        >
          Now you can start putting the money raised to good use. So what
          actions the common should take?
        </Text>
        <TouchableOpacity
          style={{ ...layout.btnPrimary, ...layout.marginTopXL }}
          onPress={createFundingProposal}
        >
          <Text style={text.buttoncenterwhite}>Create funding proposal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
  body: {
    ...layout.content,
  },
  image: {
    height: 116,
    resizeMode: 'contain',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
});

export default CommonOperationalStateNotif;

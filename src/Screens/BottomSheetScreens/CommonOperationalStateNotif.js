import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import {text, layout, colors, sizeL} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const CommonOperationalStateNotif = ({navigation, onCreateFundingProposal}) => {
  const createFundingProposal = e => {
    if (onCreateFundingProposal) {
      onCreateFundingProposal();
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
      vertical={true}
      nestedScrollEnabled={true}
      directionalLockEnabled={true}>
      <View style={styles.body}>
        <Icon name="save1" size={100} />
        <Text style={{...text.h2Black, ...layout.marginTopXL}}>
          This common is now operational
        </Text>
        <Text
          style={{...text.blackText, ...text.centered, ...layout.marginTopS}}>
          Now you can start putting the money raised to good use. So what
          actions the common should take?
        </Text>
        <TouchableOpacity
          style={{...layout.btnPrimary, ...layout.marginTopXL}}
          onPress={createFundingProposal}>
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

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
});

export default CommonOperationalStateNotif;

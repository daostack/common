import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  text, layout, colors, font,
} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const ProposalActivationDate = ({ activationDate }) => {
  const deadlineMoment = moment.unix(activationDate);
  const deadlineHasPassed = moment().isAfter(deadlineMoment);

  return !deadlineHasPassed ? (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Safety period</Text> */}
      <Text>
        <Text style={styles.subtitle}>You will be able to create proposals </Text>
        <Text style={[styles.subtitle, { fontWeight: 'bold' }]}>
          {!deadlineHasPassed ? deadlineMoment.fromNow() : ''}
        </Text>
      </Text>
      <TouchableOpacity style={styles.explanationBtn}>
        <Icon
          name="explanation1"
          color={colors.mainBlue}
          style={layout.marginRightS}
        />
        <Text style={styles.explanationBtnTextStyle}>What's this?</Text>
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    ...layout.content,
    borderWidth: 0,
    borderRadius: 14,
    backgroundColor: colors.iceBlue,
  },
  subtitle: {
    ...text.h2Black,
    fontWeight: 'normal',
    textAlign: 'center',
    ...layout.marginTopS,
    ...font.fontSize(2),
  },
  title: {
    ...text.h2Black,
  },
  timeLeftStyle: {
    ...text.h1Black,
    ...layout.marginTopS,
  },
  explanationBtnTextStyle: {
    ...text.h2Black,
    color: colors.mainBlue,
    fontWeight: 'normal',
    ...font.fontSize(2),
  },
  explanationBtn: {
    ...layout.flexRow,
    ...layout.marginTopS,
    alignItems: 'center',
  },
});

export default ProposalActivationDate;

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {numberFormatter} from '../../Util';
import moment from 'moment';

import {layout, colors, text} from '../../Theme';

const CommonStageSummary = ({isCommonCard, commonProgressInfo}) => {
  const deadlineMoment = moment.unix(commonProgressInfo.time);
  const deadlineHasPassed = moment().isAfter(deadlineMoment);
  const isFundingStage = !deadlineHasPassed;
  const renderFundingProgressBar = () => {
    return (
      <>
        <View style={styles.fundingProgressBar}>
          <View style={styles.innerProgressBar} />
        </View>
        <Text
          style={{
            ...styles.headerSmallText,
            color: colors.grey3,
            ...layout.marginTopS,
            ...layout.marginBottomS,
          }}>
          {!deadlineHasPassed ? deadlineMoment.fromNow() : ''}
        </Text>
      </>
    );
  };

  const commonNumberBox = (numberComponent, title) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.raisedContainer}>{numberComponent}</View>
        <Text style={styles.headerSmallText}>{title}</Text>
      </View>
    );
  };
  return (
    <View style={styles.commonProgressContainer}>
      <View style={styles.commonNumbers}>
        {commonNumberBox(
          isFundingStage || isCommonCard ? (
            <>
              <Text style={styles.headerTitle}>
                $
                {numberFormatter(
                  commonProgressInfo.raised / 100,
                ).toLocaleString()}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.headerTitle}>
                $
                {numberFormatter(
                  commonProgressInfo.raised / 100,
                ).toLocaleString() + ' '}
              </Text>
              <Text style={styles.headerTitle}>
                / {numberFormatter(commonProgressInfo.raised)}
              </Text>
            </>
          ),
          isFundingStage || isCommonCard ? 'Raised' : 'Available funds',
        )}
        {commonNumberBox(
          <Text style={styles.headerTitle}>{commonProgressInfo.members}</Text>,
          'Members',
        )}
        {commonNumberBox(
          isFundingStage ? (
            <Text style={styles.headerTitle}>
              ${numberFormatter(commonProgressInfo.goal / 100).toLocaleString()}
            </Text>
          ) : (
            <Text style={styles.headerTitle}>
              {commonProgressInfo.activeProposals}
            </Text>
          ),
          isFundingStage ? 'Goal' : 'ActiveProposals',
        )}
      </View>
      {isFundingStage && renderFundingProgressBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  raisedContainer: {
    ...layout.flexRow,
  },
  commonProgressContainer: {
    ...layout.content,
    paddingVertical: 0,
  },
  commonNumbers: {
    ...layout.content,
    padding: 10,
    ...layout.flexRow,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    ...text.h3Black,
  },
  headerTitleLight: {
    ...text.h3Black,
    color: colors.grey3,
  },
  fundingProgressBar: {
    width: '100%',
    borderRadius: 7,
    backgroundColor: colors.grey4,
    height: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    ...layout.marginTopS,
  },
  innerProgressBar: {
    width: 380 / 4,
    borderRadius: 6,
    backgroundColor: colors.mainBlue,
    height: 8,
  },
  headerSmallText: {
    ...text.smallBlackText,
  },
});

export default CommonStageSummary;

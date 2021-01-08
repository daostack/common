import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {layout, text, font} from '~/Theme';
import {InferProps} from 'prop-types';
import {bool, shape, number} from 'prop-types';

const props = {
  isCommonCard: bool,
  commonProgressInfo: shape({
    time: number,
    activeProposals: number,
    goal: number,
    members: number,
    raised: number,
    balance: number,
  }),
};

const CommonStageSummary: React.FC<InferProps<typeof props>> = ({
  isCommonCard,
  commonProgressInfo: {raised, balance, members},
}) => {
  // const deadlineMoment = moment.unix(time);
  // const deadlineHasPassed = moment().isAfter(deadlineMoment);
  // const isFundingStage = !deadlineHasPassed;
  /* const renderFundingProgressBar = () => {
      return (
        <>
          <View style={{width: '100%', ...layout.marginTopS, marginBottom: 10}}>
            <Progress.Bar
              progress={raised / goal}
              width={null} // null is filling the View width
              height={8}
              color={colors.mainBlue}
              borderWidth={0}
              borderRadius={7}
              unfilledColor={colors.grey4}
            />
          </View>
          <Text
            style={{
              ...styles.headerText,
              color: colors.grey3,
              ...layout.marginTopS,
              ...layout.marginBottomS,
            }}>
            {!deadlineHasPassed ? deadlineMoment.fromNow() : ''}
          </Text>
        </>
      );
    }; */
  const formatNumber = (num: number) =>
    Math.abs(num) > 999
      ? (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1) + 'K'
      : Math.sign(num) * Math.abs(num);
  const commonNumberBox = (numberComponent: any, title: string) => (
    <View
      style={{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={styles.headerSmallText}>{title}</Text>
      <View style={styles.raisedContainer}>{numberComponent}</View>
    </View>
  );
  return (
    <View style={styles.commonProgressContainer}>
      <View style={styles.commonNumbers}>
        {commonNumberBox(
          <Text style={styles.headerTitle}>
            ${formatNumber(isCommonCard ? raised / 100 : balance / 100)}
          </Text>,
          isCommonCard ? 'Raised' : 'Available funds',
        )}
        {commonNumberBox(
          <Text style={styles.headerTitle}>
            {isCommonCard ? members : '$' + formatNumber(raised / 100)}
          </Text>,
          isCommonCard ? 'Members' : 'Raised',
        )}
      </View>
    </View>
  );
};

CommonStageSummary.propTypes = props;

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
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    ...text.h3Black,
    ...font.primary.bold,
    ...font.lineHeight(2),
    ...font.fontSize(4),
    paddingTop: 5,
  },
  headerTitleLight: {
    ...text.h3Black,
  },
  headerSmallText: {
    ...text.smallBlackText,
    ...text.fontColorGreySteel,
  },
});

export default CommonStageSummary;

import {observer} from 'mobx-react';
import {bool, InferProps, number, shape} from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {font, layout, text} from '~/Theme';
import {uiStorePropTypes} from '~/Types/propTypes';
import {CurrencySymbols} from '~/Util/locale';
import {CommonNumberBox} from './CommonNumberBox';

const props = {
  isCommonCard: bool,
  uiStore: uiStorePropTypes.isRequired,
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

  return (
    <View style={styles.commonProgressContainer}>
      <View style={styles.commonNumbers}>
        <CommonNumberBox
          numberComponent={
            <Text style={styles.headerTitle}>
              {CurrencySymbols.SHEKEL}
              {formatNumber(isCommonCard ? raised / 100 : balance / 100)}
            </Text>
          }
          title={isCommonCard ? 'Raised' : 'Available funds'}
        />
        <CommonNumberBox
          numberComponent={
            <Text style={styles.headerTitle}>
              {isCommonCard
                ? members
                : CurrencySymbols.SHEKEL + formatNumber(raised / 100)}
            </Text>
          }
          title={isCommonCard ? 'Members' : 'Raised'}
        />
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
    padding: 10,
    ...layout.flexRow,
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
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
  subtitleContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleText: {
    ...text.smallBlackText,
    ...text.fontColorGreySteel,
    marginRight: 5,
  },
});

export default observer(CommonStageSummary);

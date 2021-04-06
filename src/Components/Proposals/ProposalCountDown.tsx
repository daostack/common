import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
// @ts-ignore
import CountDown from 'react-native-countdown-component';
import {number} from 'prop-types';
import {colors, font, text} from '~/Theme';

type Props = {
  closingAt: number;
};

const ProposalCountDown: FC<Props> = ({closingAt}) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const counterTextColor = styles.timerText;

  useEffect(() => {
    setRemainingSeconds(closingAt ? closingAt - Date.now() / 1000 : 0);
  }, [closingAt]);

  return (
    <View style={styles.timerContainer}>
      <View style={{...styles.timer}}>
        {remainingSeconds > 0 ? (
          <CountDown
            timeToShow={['D', 'H', 'M', 'S']}
            digitTxtStyle={counterTextColor}
            timeLabels={false}
            showSeparator={true}
            separatorStyle={counterTextColor}
            digitStyle={{
              height: 'auto',
              width: 'auto',
            }}
            until={remainingSeconds}
          />
        ) : (
          <Text style={counterTextColor}>{'00 : 00 : 00 : 00'}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerText: {
    ...text.smallBlackText,
    ...text.bold,
    color: colors.white,
    ...font.fontSize(0),
  },
  timer: {
    paddingHorizontal: 0,
    paddingVertical: 1,
    borderRadius: 12,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
  },
});

ProposalCountDown.propTypes = {
  closingAt: number.isRequired,
};

export default ProposalCountDown;

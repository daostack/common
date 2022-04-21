import React, {ReactElement, useMemo} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {observer} from 'mobx-react-lite';
import MemberImage from '~/Components/Commons/MemberImage';
import {UserModel} from '~/Stores/Models/UserModel';
import {colors, font} from '~/Theme';
import {
  VOTE_ICON_BY_STATUSES,
  VOTE_STATUSES,
  VOTE_COLORS_BY_STATUSES,
} from '~/Util/constants/votes';

interface Props {
  voteType: VOTE_STATUSES;
  voteOutcome: VOTE_STATUSES;
  votesCount: number;
  votesFor: number;
  userInfo: UserModel;
  onPress: (e: GestureResponderEvent) => void;
  disabled: boolean;
}

const ONE_PERCENTAGE_HEIGHT = 0.64;

export const VoteButton = observer(
  ({
    voteType,
    voteOutcome,
    votesCount,
    votesFor,
    userInfo,
    onPress,
    disabled,
  }: Props): ReactElement => {
    const percentage = useMemo(() => {
      if (votesFor === 0) {
        return 0;
      }
      return (votesFor / votesCount) * 100;
    }, [votesCount, votesFor]);

    return (
      <View>
        <Text
          style={[
            styles.percentageText,
            {color: VOTE_COLORS_BY_STATUSES[voteType]},
          ]}>
          {Number(percentage).toFixed(1)}%
        </Text>
        <View
          style={[
            styles.percentageColumn,
            {
              height: ONE_PERCENTAGE_HEIGHT * percentage,
              backgroundColor: VOTE_COLORS_BY_STATUSES[voteType],
            },
          ]}
        />
        <TouchableOpacity
          disabled={disabled || !!voteOutcome}
          onPress={onPress}
          style={styles.voteBtn}>
          {voteOutcome === voteType ? (
            <MemberImage
              size={31}
              imgStyle={{
                borderWidth: 3,
                borderRadius: 31 / 2,
                borderColor: VOTE_COLORS_BY_STATUSES[voteType],
              }}
              userInfo={userInfo}
            />
          ) : (
            <Icon name={VOTE_ICON_BY_STATUSES[voteType]} size={24} />
          )}
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  percentageText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 18,
    color: colors.lightishGreen,
    ...font.primary.bold,
  },
  percentageColumn: {
    backgroundColor: colors.lightishGreen,
    width: 37,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignSelf: 'center',
  },
  voteBtn: {
    height: 48,
    width: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.grey4,
    borderWidth: 1,
    shadowColor: 'rgba(0, 26, 54, 0.08)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 4,
  },
});

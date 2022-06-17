import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {CommonBoxCounterBar} from '~/Components/Commons/CommonBox/CommonBoxCounterBar';
import {Common} from '~/Stores/Models/Common';
import {colors} from '~/Theme';
import CommonBoxImage from './CommonBoxImage';
import CommonBoxSummary from './CommonBoxSummary';

interface CommonBoxProps {
  common: Common;
  onPress: () => void;
  width: string;
  headerHeightLayouted: (height: number) => void;
}

const CommonBox = ({
  common,
  width = '100%',
  headerHeightLayouted,
}: CommonBoxProps) => {
  const navigation = useNavigation();

  const onBoxPress = () => {
    navigation.navigate('CommonProfile', {
      screen: 'CommonAgenda',
      params: {currCommon: common},
    });
  };

  return (
    <TouchableOpacity
      onPress={onBoxPress}
      style={[styles.commonBox, {width}]}
      onLayout={(event) => {
        if (headerHeightLayouted) {
          headerHeightLayouted(event.nativeEvent.layout.height);
        }
      }}>
      <CommonBoxImage
        cover={common.image}
        name={common.name}
        description={common.byline}
        updatedAt={common.updatedAt}
      />

      <CommonBoxSummary
        members={common.memberCount}
        raised={common.raised}
        balance={common.balance}
      />

      <CommonBoxCounterBar common={common} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  commonBox: {
    marginBottom: 20,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 26, 54, 0.08)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 4,
  },
  bottomBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '100%',
    height: 48,
    borderTopWidth: 1,
    borderTopColor: colors.grey4,
    paddingHorizontal: 10,
  },
});

export default observer(CommonBox);

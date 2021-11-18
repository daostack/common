import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {CommonCover} from './Commons';
import {CommonStageSummary} from './Commons/CommonStageSummary';
import {Common} from '~/Stores/Models';

const CommonBox = ({
  common,
  onPress,
  width = '100%',
  headerHeightDidLayout,
}: {
  common: Common;
  onPress(): void;
  width: string | number;
  headerHeightDidLayout(height: number): void;
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        const navigate = CommonActions.navigate({
          name: 'CommonProfile',
          params: {
            currCommon: common,
          },
        });
        navigation.dispatch(navigate);
      }}
      style={[styles.commonBox, {width}]}
      onLayout={(event) => {
        if (headerHeightDidLayout) {
          headerHeightDidLayout(event.nativeEvent.layout.height);
        }
      }}>
      <CommonCover common={common} />

      <CommonStageSummary isCommonCard={true} common={common} />
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
});

export default CommonBox;

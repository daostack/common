import {observer} from 'mobx-react';
import React, {ReactElement, ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {layout, text} from '~/Theme';

interface Props {
  numberComponent: ReactNode;
  title: string;
}

export const CommonNumberBox = observer(
  ({numberComponent, title}: Props): ReactElement => (
    <View style={styles.numberBoxContainer}>
      <Text style={styles.headerSmallText}>{title}</Text>
      <View style={styles.raisedContainer}>{numberComponent}</View>
    </View>
  ),
);

const styles = StyleSheet.create({
  numberBoxContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerSmallText: {
    ...text.smallBlackText,
    ...text.fontColorGreySteel,
  },
  raisedContainer: {
    ...layout.flexRow,
  },
});

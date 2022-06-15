import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, font} from '~/Theme';
import {screenWidth} from '~/Util/dimensions';

export const WalletTabs = {
  all: 'all',
  payin: 'payin',
  payout: 'payout',
};

interface WalletTabSwitcherProps {
  activeTab: string;
  switchTab: (activeTab: string) => void;
}

export const CommonWalletTabs = (props: WalletTabSwitcherProps) => {
  const {activeTab, switchTab} = props;
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => switchTab(WalletTabs.all)}>
        <Text
          style={[
            styles.tabText,
            activeTab === WalletTabs.all ? {color: colors.mainBlue} : {},
          ]}>
          All
        </Text>
        {activeTab === WalletTabs.all && <View style={styles.dot} />}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => switchTab(WalletTabs.payin)}>
        <Text
          style={[
            styles.tabText,
            activeTab === WalletTabs.payin ? {color: colors.mainBlue} : {},
          ]}>
          Pay-In
        </Text>
        {activeTab === WalletTabs.payin && <View style={styles.dot} />}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => switchTab(WalletTabs.payout)}>
        <Text
          style={[
            styles.tabText,
            activeTab === WalletTabs.payout ? {color: colors.mainBlue} : {},
          ]}>
          Pay-Out
        </Text>
        {activeTab === WalletTabs.payout && <View style={styles.dot} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 78,
    backgroundColor: colors.white,
    background: '#FFFFFF',
    borderBottomColor: colors.white2,
    borderBottomWidth: 1,
  },
  tab: {
    width: screenWidth / 3,
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
  tabText: {
    textAlign: 'center',
    color: colors.greySubtitle,
    ...font.primary.bold,
    fontSize: 18,
    paddingBottom: 3,
  },
  dot: {
    position: 'absolute',
    backgroundColor: colors.mainBlue,
    height: 6,
    width: 6,
    borderRadius: 6,
    alignSelf: 'center',
    bottom: 16,
  },
});

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, font} from '~/Theme';
import {screenWidth} from '~/Util/dimensions';
import Icon from '~/Assets/iconfont/Icon';

export const WhitePaperCircleTabs = {
  standard: 'Standard',
  senior: 'Senior',
  leader: 'Leader',
};

type WhitePaperTabSwitcherProps = {
  activeTab: string;
  switchTab: (activeTab: string) => void;
};

const getColor = (activeTab: string, tabName: string) =>
  activeTab === tabName ? colors.mainBlue : '#979BBA';

export const WhitePaperTabs = ({
  activeTab,
  switchTab,
}: WhitePaperTabSwitcherProps) => (
  <View style={styles.tabsContainer}>
    <TouchableOpacity
      style={styles.tab}
      onPress={() => switchTab(WhitePaperCircleTabs.standard)}>
      <View style={{...styles.imageView, width: 32}}>
        <Icon
          name="standard"
          color={getColor(activeTab, WhitePaperCircleTabs.standard)}
        />
      </View>
      <Text
        style={[
          styles.tabText,
          activeTab === WhitePaperCircleTabs.standard
            ? {color: colors.mainBlue}
            : {},
        ]}>
        {WhitePaperCircleTabs.standard}
      </Text>
      {activeTab === WhitePaperCircleTabs.standard && (
        <View style={styles.dot} />
      )}
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.tab}
      onPress={() => switchTab(WhitePaperCircleTabs.senior)}>
      <View style={{...styles.imageView, width: 42}}>
        <Icon
          name="senior"
          color={getColor(activeTab, WhitePaperCircleTabs.senior)}
        />
      </View>
      <Text
        style={[
          styles.tabText,
          activeTab === WhitePaperCircleTabs.senior
            ? {color: colors.mainBlue}
            : {},
        ]}>
        {WhitePaperCircleTabs.senior}
      </Text>
      {activeTab === WhitePaperCircleTabs.senior && <View style={styles.dot} />}
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.tab}
      onPress={() => switchTab(WhitePaperCircleTabs.leader)}>
      <View style={{...styles.imageView, width: 52}}>
        <Icon
          name="leader"
          color={getColor(activeTab, WhitePaperCircleTabs.leader)}
        />
      </View>
      <Text
        style={[
          styles.tabText,
          activeTab === WhitePaperCircleTabs.leader
            ? {color: colors.mainBlue}
            : {},
        ]}>
        {WhitePaperCircleTabs.leader}
      </Text>
      {activeTab === WhitePaperCircleTabs.leader && <View style={styles.dot} />}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 100,
    backgroundColor: colors.white,
    background: '#FFFFFF',
    borderBottomColor: colors.white2,
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
  imageView: {
    height: 32,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

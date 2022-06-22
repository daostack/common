import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';
import {screenWidth} from '~/Util/dimensions';

export const WhitePaperTypeTabs = {
  members: 'Members',
  proposals: 'Proposals',
};

type WhitePaperTypeTabProps = {
  activeTab: string;
  switchTab: (activeTab: string) => void;
};

const getColor = (activeTab: string, tabName: string) =>
  activeTab === tabName ? colors.white : colors.mainBlue;

export const WhitePaperTypeTab = ({
  activeTab,
  switchTab,
}: WhitePaperTypeTabProps) => (
  <View style={styles.tabsContainer}>
    <TouchableOpacity
      style={{
        ...styles.tab,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor:
          activeTab === WhitePaperTypeTabs.members
            ? colors.mainBlue
            : colors.white,
      }}
      onPress={() => switchTab(WhitePaperTypeTabs.members)}>
      <Text
        style={{
          ...styles.tabText,
          color: getColor(activeTab, WhitePaperTypeTabs.members),
        }}>
        {WhitePaperTypeTabs.members}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        ...styles.tab,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor:
          activeTab === WhitePaperTypeTabs.proposals
            ? colors.mainBlue
            : colors.white,
      }}
      onPress={() => switchTab(WhitePaperTypeTabs.proposals)}>
      <Text
        style={{
          ...styles.tabText,
          color: getColor(activeTab, WhitePaperTypeTabs.proposals),
        }}>
        {WhitePaperTypeTabs.proposals}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    background: '#FFFFFF',
    borderBottomColor: colors.white2,
  },
  tabText: {
    textAlign: 'center',
    //...font.primary.bold,
    fontSize: 18,
    paddingBottom: 3,
  },
  tab: {
    width: '45%',
    height: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.greySubtitle,
  },
});

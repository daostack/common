import React, {useCallback, useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {colors, font, text} from '~/Theme';
import {PROPOSAL_STATE, PROPOSAL_TYPE} from '~/Config';
import {WhitePaperHeader} from './components/WhitePaperHeader';
import {WhitePaperTabs, WhitePaperCircleTabs} from './components/WhitePaperTab';
import {
  WhitePaperTypeTab,
  WhitePaperTypeTabs,
} from './components/WhitePaperTypeTab';

const WhitePaper = () => {
  const route = useRoute();
  const {currCommon} = route.params;

  const keyExtractor = useCallback((data) => data.id, []);

  const [activeTabCircles, setActiveTabCircles] = useState(
    WhitePaperCircleTabs.standard,
  );
  const [activeTabType, setActiveTabType] = useState(
    WhitePaperTypeTabs.members,
  );

  const switchCircleTab = (tabName: string) => {
    setActiveTabCircles(tabName);
  };

  const switchTypeTab = (tabName: string) => {
    setActiveTabType(tabName);
  };

  const onScroll = (e) => {
    /*if (e.nativeEvent.contentOffset.y > WALLET_HEADER_HEIGHT - insets.top) {
      setShowTopTabs(true);
    } else {
      setShowTopTabs(false);
    }*/
  };

  return (
    <View>
      <FlatList
        onScroll={onScroll}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        contentContainerStyle={styles.flatListContainer}
        style={styles.listContainer}
        listKey="WhitePaper"
        bounces={false}
        keyExtractor={keyExtractor}
        ListHeaderComponent={() => (
          <WhitePaperHeader common={currCommon}>
            <WhitePaperTabs
              activeTab={activeTabCircles}
              switchTab={switchCircleTab}
            />
            <Text style={[styles.transactionsTitle, text.h2Black]}>
              {activeTabCircles === WhitePaperCircleTabs.standard
                ? 'tesmp'
                : activeTabCircles === WhitePaperCircleTabs.senior
                ? 'senior stuff'
                : 'leader stuff'}
            </Text>
            <Text style={styles.whitePaperSubtitle}>
              Common's set of guides are managed by user type
            </Text>
          </WhitePaperHeader>
        )}
      />
      <WhitePaperTypeTab activeTab={activeTabType} switchTab={switchTypeTab} />
      <WhitePaperTabs
        activeTab={activeTabCircles}
        switchTab={switchCircleTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    //paddingBottom: 20,
    borderWidth: 1,
    flex: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.grey5,
  },
  transactionsTitle: {
    marginTop: 24,
    marginBottom: 20,
  },
  noDataText: {
    textAlign: 'center',
    ...font.primary.regular,
  },
  whitePaperSubtitle: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 14,
    color: colors.greySubtitle,
  },
});

export default WhitePaper;

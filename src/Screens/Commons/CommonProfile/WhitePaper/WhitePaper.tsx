import React, {useCallback, useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {colors, font, text} from '~/Theme';
import {PROPOSAL_STATE, PROPOSAL_TYPE} from '~/Config';
import {WhitePaperHeader} from './components/WhitePaperHeader';
import {WhitePaperTabs, WhitePaperCircleTabs} from './components/WhitePaperTab';

const WhitePaper = () => {
  const route = useRoute();
  const {currCommon} = route.params;

  const keyExtractor = useCallback((data) => data.id, []);

  const [activeTab, setActiveTab] = useState(WhitePaperCircleTabs.standard);

  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
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
            <WhitePaperTabs activeTab={activeTab} switchTab={switchTab} />
            <Text style={[styles.transactionsTitle, text.h2Black]}>
              {activeTab === WhitePaperCircleTabs.standard
                ? 'tesmp'
                : activeTab === WhitePaperCircleTabs.senior
                ? 'senior stuff'
                : 'leader stuff'}
            </Text>
            <Text style={styles.noDataText}>No transactions yet</Text>
          </WhitePaperHeader>
        )}
      />
      <WhitePaperTabs activeTab={activeTab} switchTab={switchTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 20,
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
});

export default WhitePaper;

import {useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PROPOSAL_STATE, PROPOSAL_TYPE} from '~/Config';
import {CommonWalletHeader} from '~/Screens/Commons/CommonProfile/CommonWallet/components/CommonWalletHeader';
import {
  CommonWalletTabs,
  WalletTabs,
} from '~/Screens/Commons/CommonProfile/CommonWallet/components/CommonWalletTabs';
import {PayInCard} from '~/Screens/Commons/CommonProfile/CommonWallet/components/PayInCard';
import {PayOutCard} from '~/Screens/Commons/CommonProfile/CommonWallet/components/PayOutCard';
import {colors, font, text} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';

const WALLET_HEADER_HEIGHT = 264;

export const CommonWallet = observer(() => {
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const paymentStore = useStore('paymentStore');
  const proposalStore = useStore('proposalStore');
  const commonStore = useStore('commonStore');

  const commonId = route?.params?.commonId;
  const currCommon = commonStore.getCommonById(commonId)!;

  const [activeTab, setActiveTab] = useState(WalletTabs.all);

  const payments = paymentStore.getCommonPayments(currCommon.id);
  const payouts = proposalStore.getCommonProposals(currCommon.id, {
    state: PROPOSAL_STATE.Passed,
    type: PROPOSAL_TYPE.FundingRequest,
  });

  const transactions = [...payouts, ...payments].sort(
    (payment, prevPayment) =>
      prevPayment?.updatedAt?.seconds - payment?.updatedAt?.seconds,
  );

  const [data, setData] = useState(transactions);

  useEffect(() => {
    if (activeTab === WalletTabs.all) {
      setData(transactions);
    } else if (activeTab === WalletTabs.payin) {
      setData(payments);
    } else if (activeTab === WalletTabs.payout) {
      setData(payouts);
    }
  }, [activeTab, transactions?.length]);

  useEffect(() => {
    let unsubscribeFromCommonPayments = null;
    let unsubscribeFromCommonProposals = null;
    if (currCommon?.id) {
      unsubscribeFromCommonPayments = paymentStore.subscribeToCommonPayments(
        currCommon?.id,
      );
      unsubscribeFromCommonProposals = proposalStore.subscribeToCommonProposals(
        currCommon?.id,
      );
    }
    return () => {
      unsubscribeFromCommonPayments && unsubscribeFromCommonPayments();
      unsubscribeFromCommonProposals && unsubscribeFromCommonProposals();
    };
  }, [currCommon]);

  const keyExtractor = useCallback(
    (callbackData, index) => callbackData.id + index,
    [],
  );

  const switchTab = useCallback((tabName: string = WalletTabs.all) => {
    setActiveTab(tabName);
  }, []);

  const [showTopTabs, setShowTopTabs] = useState(false);
  const onScroll = (e) => {
    if (e.nativeEvent.contentOffset.y > WALLET_HEADER_HEIGHT - insets.top) {
      setShowTopTabs(true);
    } else {
      setShowTopTabs(false);
    }
  };

  const TabTitle = useMemo(() => {
    switch (activeTab) {
      case WalletTabs.all:
        return 'All Transactions';
      case WalletTabs.payin:
        return 'Pay-In Transactions';
      case WalletTabs.payout:
        return 'Pay-Out Transactions';
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      {showTopTabs && (
        <View style={[styles.headerTabs, {paddingTop: insets.top}]}>
          <CommonWalletTabs activeTab={activeTab} switchTab={switchTab} />
        </View>
      )}
      <FlatList
        onScroll={onScroll}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        contentContainerStyle={styles.flatListContainer}
        style={styles.listContainer}
        listKey="WalletList"
        bounces={false}
        keyExtractor={keyExtractor}
        ListHeaderComponent={() => (
          <CommonWalletHeader common={currCommon}>
            <>
              <CommonWalletTabs activeTab={activeTab} switchTab={switchTab} />
              <Text style={[styles.transactionsTitle, text.h2Black]}>
                {TabTitle}
              </Text>
              {data?.length === 0 && (
                <Text style={styles.noDataText}>No transactions yet</Text>
              )}
            </>
          </CommonWalletHeader>
        )}
        data={data}
        renderItem={({item}) => {
          if (item.userId) {
            return (
              <PayInCard
                userId={item.userId}
                key={item.id}
                amount={item?.amount}
                date={item.createdAt}
                description={item.description}
              />
            );
          } else {
            return (
              <>
                {item?.fundingAllocation?.funded &&
                  item?.fundingAllocation?.amount !== 0 && (
                    <PayOutCard
                      key={item.id}
                      funded={item?.fundingAllocation?.funded}
                      amount={item?.fundingAllocation?.amount}
                      date={item.createdAt}
                      description={item.description?.description}
                    />
                  )}
              </>
            );
          }
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.grey5,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  transactionsTitle: {
    marginTop: 24,
    marginBottom: 20,
  },
  headerTabs: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 0,
    zIndex: 99,
  },
  noDataText: {
    textAlign: 'center',
    ...font.primary.regular,
  },
  addFundsContainer: {
    backgroundColor: colors.iceBlue,
  },
});

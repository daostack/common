import {useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PROPOSAL_STATE, PROPOSAL_TYPE} from '~/Config';
import {CommonWalletHeader} from '~/Screens/Commons/CommonProfile/Wallet/components/CommonWalletHeader';
import {
  CommonWalletTabs,
  WalletTabs,
} from '~/Screens/Commons/CommonProfile/Wallet/components/CommonWalletTabs';
import {PayInCard} from '~/Screens/Commons/CommonProfile/Wallet/components/PayInCard';
import {PayOutCard} from '~/Screens/Commons/CommonProfile/Wallet/components/PayOutCard';
import {colors, font, text} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';

const WALLET_HEADER_HEIGHT = 264;

export const CommonWallet = observer(() => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {currCommon} = route.params;
  const paymentStore = useStore('paymentStore');
  const proposalStore = useStore('proposalStore');
  const commonStore = useStore('commonStore');

  const [activeTab, setActiveTab] = useState(WalletTabs.all);

  const common = commonStore.getCommonById(currCommon.id);
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
  }, [activeTab]);

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

  const keyExtractor = useCallback((data) => data.id, []);

  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const [showTopTabs, setShowTopTabs] = useState(false);
  const onScroll = (e) => {
    if (e.nativeEvent.contentOffset.y > WALLET_HEADER_HEIGHT - insets.top) {
      setShowTopTabs(true);
    } else {
      setShowTopTabs(false);
    }
  };

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
          <CommonWalletHeader common={common}>
            <CommonWalletTabs activeTab={activeTab} switchTab={switchTab} />
            <Text style={[styles.transactionsTitle, text.h2Black]}>
              {activeTab === WalletTabs.all
                ? 'All Transactions'
                : activeTab === WalletTabs.payin
                ? 'Pay-In Transactions'
                : 'Pay-Out Transactions'}
            </Text>
            {data.length === 0 && (
              <Text style={styles.noDataText}>No transactions yet</Text>
            )}
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
                {item?.fundingRequest?.funded &&
                item?.fundingRequest?.amount !== 0 ? (
                  <PayOutCard
                    key={item.id}
                    funded={item?.fundingRequest?.funded}
                    amount={item?.fundingRequest?.amount}
                    date={item.createdAt}
                    description={item.description?.description}
                  />
                ) : (
                  <Text style={styles.noDataText}>No transactions yet</Text>
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
});

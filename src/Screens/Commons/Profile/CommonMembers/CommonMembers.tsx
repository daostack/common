import React, {useState, ReactElement} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {TabView, TabBarProps} from 'react-native-tab-view';
import {observer, inject} from 'mobx-react';

import CommonMembersList from '../CommonMembersList';
import CommonTabBar from '../../../CommonTabBar';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import {STORE_KEYS} from '~/Util/constants/storeKeys';
import {CommonMembersRouteProps, CommonMembersProps} from './types';
import {History} from './Components/History';
import {Pending} from './Components/Pending';
import {styles} from './styles';

const initialLayout = {width: Dimensions.get('window').width};

const getTabName = (objectName: string, count: number): string =>
  `${objectName} (${count ? count : 0})`;

const CommonMembers = ({rootStore}: CommonMembersProps) => {
  const proposalStore = rootStore.proposalStore;
  const commonStore = rootStore.commonStore;
  const router = useRoute<CommonMembersRouteProps>();

  const {
    commonId,
    hasPermission,
    openCommonOptions,
    showHiddenNote,
    isMember,
  } = router.params;
  const [index, setIndex] = useState(0);
  const pendingCount = proposalStore.getCommonProposals(commonId, {
    stage: PROPOSAL_STAGE.Active,
    type: PROPOSAL_TYPE.Join,
  }).length;
  const historyCount = proposalStore.getCommonProposals(commonId, {
    stage: PROPOSAL_STAGE.History,
    type: PROPOSAL_TYPE.Join,
  }).length;
  const membersCount = commonStore.getCommonById(commonId)?.members.length;

  const routes = [
    {
      key: 'members',
      title: getTabName('Members', membersCount),
    },
    {key: 'pending', title: getTabName('Pending', pendingCount)},
    {key: 'history', title: getTabName('History', historyCount)},
  ];

  const renderScene = ({
    route,
  }: {
    route: {key: string; title: string};
  }): ReactElement | null => {
    switch (route.key) {
      case 'members':
        return <CommonMembersList commonId={commonId} />;
      case 'pending':
        return (
          <Pending
            commonId={commonId}
            hasPermission={hasPermission}
            openCommonOptions={openCommonOptions}
            showHiddenNote={showHiddenNote}
            isMember={isMember}
          />
        );
      case 'history':
        return <History commonId={commonId} />;
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>Members</Text>
          </View>

          <View style={styles.sectionTabView}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={CommonTabBar}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default inject('rootStore')(
  observer((props: Omit<CommonMembersProps, STORE_KEYS>) => (
    <CommonMembers {...(props as CommonMembersProps)} />
  )),
);

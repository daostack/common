import React, { useState } from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { TabView } from 'react-native-tab-view';
import {
  layout, font, colors, text, sizeS,
} from '../../../Theme';
import ProposalsList from '../../Proposals/ProposalsList';
import CommonMembersList from './CommonMembersList';
import CommonTabBar from '../../CommonTabBar';

const getTabName = (objectName, count) => `${objectName} (${count || 0})`;

const Members = ({ navigation, members }) => (
  <CommonMembersList navigation={navigation} members={members} />
);

const Pending = ({ navigation, commonId, onProposalsCountChange }) => (
  <View style={layout.content}>
    <ProposalsList
      navigation={navigation}
      commonInfo={{ id: commonId }}
      onlyRequestsToJoin
      onCountChange={onProposalsCountChange}
    />
  </View>
);

const History = ({ navigation, commonId, onProposalsCountChange }) => (
  <View style={layout.content}>
    <ProposalsList
      navigation={navigation}
      commonInfo={{ id: commonId }}
      onlyRequestsToJoin
      isHistory
      onCountChange={onProposalsCountChange}
    />
  </View>
);

const initialLayout = { width: Dimensions.get('window').width };

const CommonMembers = ({ navigation, route }) => {
  const [index, setIndex] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const { members } = route.params;
  const { commonId } = route.params;

  const routes = [
    { key: 'members', title: getTabName('Members', members.length) },
    { key: 'pending', title: getTabName('Pending', pendingCount) },
    { key: 'history', title: getTabName('History', historyCount) },
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'members':
        return <Members navigation={navigation} members={members} />;
      case 'pending':
        return (
          <Pending
            navigation={navigation}
            commonId={commonId}
            onProposalsCountChange={(count) => setPendingCount(count)}
          />
        );
      case 'history':
        return (
          <History
            navigation={navigation}
            commonId={commonId}
            onProposalsCountChange={(count) => setHistoryCount(count)}
          />
        );
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
          vertical
          nestedScrollEnabled
          directionalLockEnabled
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>Members</Text>
          </View>

          <View style={styles.sectionTabView}>
            <TabView
              navigationState={{ index, routes }}
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

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  sectionTabView: {},
  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'center',
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(5),
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,
    color: colors.black,
    fontWeight: 'bold',
  },
  tabStyle: {
    ...text.ashleyjquimbacom2,
    fontWeight: 'bold',
  },
});

export default CommonMembers;

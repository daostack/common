import React, {useState, useEffect} from 'react';

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
import {layout, font, colors, text, sizeS} from '../../../Theme';
import {TabView} from 'react-native-tab-view';
import ProposalsList from '../../Proposals/ProposalsList';
import CommonMembersList from './CommonMembersList';
import CommonTabBar from '../../CommonTabBar';
import ArcService from '../../../Services/ArcService';

const getTabName = (objectName, count) => {
  return `${objectName} (${count ? count : 0})`;
};

const Members = ({navigation, members}) => {
  return (
    <CommonMembersList navigation={navigation} members={members} />
  );
};

const Pending = ({navigation, commonId, onProposalsCountChange}) => {
  return (
    <View style={layout.content}>
      <ProposalsList
        navigation={navigation}
        commonInfo={{ id: commonId }}
        onlyRequestsToJoin={true}
        onCountChange={onProposalsCountChange}
      />
    </View>
  );
};

const History = ({navigation, commonId, onProposalsCountChange}) => {
  return (
    <View style={layout.content}>
      <ProposalsList
        navigation={navigation}
        commonInfo={{ id: commonId }}
        onlyRequestsToJoin={true}
        isHistory={true}
        onCountChange={onProposalsCountChange}
      />
    </View>
  );
};

const initialLayout = {width: Dimensions.get('window').width};

const CommonMembers = ({navigation, route}) => {
  const [index, setIndex] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const members = route.params.members;
  const commonId = route.params.commonId;

  const service = ArcService.getInstance();

  useEffect(() => {
    console.log('CommonMembers --> refresh');
  }, [service.voteRefreshFlag]);

  const routes = [
    {key: 'members', title: getTabName('Members', members.length)},
    {key: 'pending', title: getTabName('Pending', pendingCount)},
    {key: 'history', title: getTabName('History', historyCount)},
  ];

  const renderScene = ({route}) => {
    switch (route.key) {
    case 'members':
      return <Members navigation={navigation} members={members} />;
    case 'pending':
      return (
        <Pending
          navigation={navigation}
          commonId={commonId}
          onProposalsCountChange={(count)=> setPendingCount(count)}
        />
      );
    case 'history':
      return (
        <History
          navigation={navigation}
          commonId={commonId}
          onProposalsCountChange={count => setHistoryCount(count)}
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
          vertical={true}
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

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
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

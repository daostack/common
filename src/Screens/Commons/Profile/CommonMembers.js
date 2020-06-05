import React, {useState} from 'react';

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

import MemberCard from '../../../Components/MemberCard';
import {layout, colors, text, sizeS} from '../../../Theme';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import ProposalsList from '../../Proposals/ProposalsList';

const getTabName = (objectName, count) => {
  return `${objectName} (${count ? count : 0})`;
};

const CommonMembers = ({navigation, route}) => {
  const [index, setIndex] = useState(0);
  const [pendingCount, setPendingCount] = useState(4);
  const members = route.params.members;

  const routes = [
    {key: 'members', title: getTabName('Members', members.length)},
    {key: 'pending', title: getTabName('Pending', pendingCount)},
  ];

  const Members = () => {
    return sceneRenderer(0);
  };

  const onProposalsCountChange = count => {
    setPendingCount(count);
  };

  const Pending = () => {
    return (
      <View style={layout.content}>
        <ProposalsList
          navigation={navigation}
          commonId={route.params.commonId}
          onlyRequestsToJoin={true}
          onCountChange={onProposalsCountChange}
        />
      </View>
    );
  };

  const sceneRenderer = sceneIndex => {
    return (
      <View style={layout.marginTopL}>
        {members.map((member, i) => {
          return (
            <MemberCard
              key={i}
              name={member.displayName}
              approvePercent={member.approvalPercentage}
              imageUrl={member.photoURL}
              //TODO: change pending status
              isPending={sceneIndex === 1}
              date={member.date}
              member={member}
            />
          );
        })}
      </View>
    );
  };

  const initialLayout = {width: Dimensions.get('window').width};

  const renderScene = SceneMap({
    members: Members,
    pending: Pending,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.black,
      }}
      renderLabel={({route, focused, color}) => {
        return (
          <Text style={focused ? styles.tabStyleActive : styles.tabStyle}>
            {route.title}
          </Text>
        );
      }}
      style={{backgroundColor: colors.white}}
      tabStyle={{width: 'auto'}}
    />
  );
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
            <Text style={text.h2Black}>Members</Text>
          </View>

          <View style={styles.sectionTabView}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
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
    alignItems: 'flex-start',
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

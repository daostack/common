import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { CommonActions } from '@react-navigation/native';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';

import RequestToJoinRule from '../../../Components/Commons/RequestToJoinRule';
import CreateStepHeader from './RequestStepHeader';
import CreateStepDotHeader from './RequestStepDotHeader';
import { colors } from '../../../Theme';
import CreateStepNavigation from './RequestStepNavigation';
import RequestStepActionButton from '../RequestStepActionButton';
import MembershipRequest from './MembershipRequest';

const { width, height } = Dimensions.get('window');

const RequestStep1 = (props) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  // const [ruleCount] = useState(1);
  const [pass, setPass] = useState(false);
  const commonRules = props.daoStore.dao.metadata?.rules;

  const { name } = props.daoStore.dao;

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(height);
  }, [scrollY]);

  const onScrollToBottom = () => {
    setPass(true);
  };

  const push = () => {
    if (pass) {
      const navigate = CommonActions.navigate({
        name: 'RequestStep2',
        params: {
          currDaoId: props.route.params.currDaoId,
        },
      });
      props.navigation.dispatch(navigate);
    }
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        <CreateStepNavigation
          navigation={props.navigation}
          title={name}
        />
        <CreateStepDotHeader
          title="Approve Common Rules"
          currentIndex={1}
          navigation={props.navigation}
          headerHeight={headerHeight}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          width={width}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onContentSizeChange={(_width, contentHeight) => contentHeight < (height - 150) && setPass(true)}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: scrollY } } },
          ])}
          onScrollEndDrag={onScrollToBottom}
        >
          <MembershipRequest />
          <CreateStepHeader
            currentIndex={0}
            isFirstStepSkipped={false}
          />
          <View
            style={{
              flex: 1,
              // alignItems: 'center',
              backgroundColor: 'white',
            }}
          >
            <RequestStepHeaderTitle title="Accept Common Rules" subtitle="If the Common approves your request you will become a member with equal voting rights." />
            <View
              style={styles.content}
            />
            {Boolean(commonRules?.length)
              && commonRules.map((rule, index) => (
                <RequestToJoinRule
                  index={index + 1}
                  title={rule.title}
                  description={rule.description}
                />
              ))}
          </View>
        </ScrollView>
        <RequestStepActionButton title="Continue" pass={pass} onPress={push} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.grey4,
    height: 1,
    marginBottom: 40,
  },
});

export default inject('daoStore')(observer(RequestStep1));

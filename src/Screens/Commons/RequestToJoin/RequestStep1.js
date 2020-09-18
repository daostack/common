import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import RequestStepHeaderTitle from './RequestStepHeaderTitle';
import RequestToJoinRule from '~/Components/Commons/RequestToJoinRule';
import CreateStepHeader from './RequestStepHeader';
import CreateStepDotHeader from './RequestStepDotHeader';
import {colors} from '~/Theme';
import CreateStepNavigation from './RequestStepNavigation';
import RequestStepActionButton from '../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import MembershipRequest from './MembershipRequest';
import {string, array, object} from 'prop-types';
const {width, height} = Dimensions.get('window');

const RequestStep1 = ({navigation, route, daoStore}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(0);
  const [pass, setPass] = useState(false);

  const {params} = route;

  const name = params.currCommon.name;

  useEffect(() => {
    const newHeight = scrollY.interpolate({
      inputRange: [50, 50],
      outputRange: [0, 67],
      extrapolate: 'clamp',
    });
    setHeaderHeight(newHeight);
  }, [scrollY]);

  const onScrollToBottom = () => {
    setPass(true);
  };

  const push = () => {
    if (pass) {
      const navigate = CommonActions.navigate({
        name: 'RequestStep2',
        params: {
          currDaoId: params.currDaoId,
          currCommon: params.currCommon,
        },
      });
      navigation.dispatch(navigate);
    }
  };

  return (
    <React.Fragment>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <CreateStepNavigation
          navigation={navigation}
          title={name}
        />
        <CreateStepDotHeader
          title="Approve Common Rules"
          currentIndex={1}
          navigation={navigation}
          headerHeight={headerHeight}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScrollEndDrag={onScrollToBottom}
          scrollEventThrottle={16}
          width={width}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: scrollY},
              },
            },
          ])}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onContentSizeChange={(_width, contentHeight) => {
            contentHeight < (height - 150) && setPass(true)
          }}
          scrollEventThrottle={16}
          onScroll={() => {
            Animated.event([{
              nativeEvent: {
                contentOffset: {y: scrollY}
              }
            }])
          }}
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
            }}>
            <RequestStepHeaderTitle
              title="Accept Common Rules"
              subtitle="If the Common approves your request you will become a member with equal voting rights."
            />

            <View style={styles.content}/>

            {daoStore.dao.metadata?.rules.length > 0 &&
              daoStore.dao.metadata.rules.map((rule, index) => (
                <RequestToJoinRule
                  index={index + 1}
                  title={rule.title}
                  description={rule.description}
                  url={rule.url}
                />
              ))}
          </View>
        </ScrollView>
        <RequestStepActionButton title="Continue" pass={pass} onPress={push} />
      </SafeAreaView>
    </>
  );
};

RequestStep1.propTypes = {
  navigation: object,
  route: {
    params: {
      currDaoId: string,
    },
  },
  daoStore: {
    dao: {
      name: string,
      metadata: {
        rules: {
          commonRules: array,
        },
      },
    },
  },
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.grey4,
    height: 1,
    marginBottom: 40,
  },
});

export default RequestStep1;

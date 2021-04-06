import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import RequestStepHeaderTitle from '../RequestStepHeaderTitle';
import RequestToJoinRule from '~/Components/Commons/RequestToJoinRule';
import {colors} from '~/Theme';
import RequestStepActionButton from '../../RequestStepActionButton';
import {CommonActions} from '@react-navigation/native';
import MembershipRequest from '../MembershipRequest';
import {string, object, bool, shape, func} from 'prop-types';
import StepDotLayout from '~/Components/Layouts/StepDotLayout';

const RulesStep = ({
  navigation,
  route: {
    params: {formStores, currCommon, currDaoId, refreshFeed},
  },
}) => {
  const [pass, setPass] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [contentStaticHeight, setContentStaticHeight] = useState(0);

  useEffect(() => {
    if (contentStaticHeight !== 0 && contentHeight !== 0) {
      setPass(!(contentHeight > contentStaticHeight));
    }
  }, [contentHeight, contentStaticHeight]);

  const onScrollToBottom = () => {
    setPass(true);
  };

  const push = () => {
    if (pass) {
      const navigate = CommonActions.navigate({
        name: 'IntroductionStep',
        params: {
          formStores,
          currDaoId: currDaoId,
          currCommon: currCommon,
          refreshFeed,
        },
      });
      navigation.dispatch(navigate);
    }
  };

  return (
    <StepDotLayout
      navigation={navigation}
      stepDotHeaderTitle="Accept Common Rules"
      navTitle={currCommon.name}
      currentIndex={1}
      layoutTitle={<MembershipRequest />}
      isRequestToJoin={true}
      onScrollEndDrag={onScrollToBottom}
      onContentSizeChange={(height) => setContentStaticHeight(height)}
      requestStepActionButton={
        <RequestStepActionButton title="Continue" pass={pass} onPress={push} />
      }>
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

        <View style={styles.content} />

        <View
          onLayout={(event) => {
            setContentHeight(event.nativeEvent.layout.height);
          }}>
          {currCommon?.rules?.length > 0 &&
            currCommon.rules.map((rule, index) => (
              <RequestToJoinRule
                key={index}
                index={index + 1}
                title={rule.title}
                description={rule.description}
                url={rule.value || rule.url} // NOTE: value of multiple fields was stored in url prop before
              />
            ))}
        </View>
      </View>
    </StepDotLayout>
  );
};

RulesStep.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      currCommon: object,
      currDaoId: string,
      skipFirstStep: bool,
      refreshFeed: func,
    }),
  }),
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.grey4,
    height: 1,
    marginBottom: 40,
  },
});

export default RulesStep;

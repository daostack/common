import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {colors, font, layout, text} from '~/Theme';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {
  BillingDetailsFormStore,
  IntroduceYourselfFormStore,
  PaymentFormStore,
  PersonalContributionFormStore,
} from '~/Stores/FormStores/RequestToJoin';
import {CommonActions} from '@react-navigation/native';
import {bool, func, InferProps, object, shape, string} from 'prop-types';

const props = {
  navigation: shape({
    navigate: func.isRequired,
    dispatch: func.isRequired,
  }).isRequired,
  route: shape({
    params: shape({
      currCommon: object.isRequired,
      currDaoId: string.isRequired,
      refreshFeed: bool.isRequired,
    }).isRequired,
  }).isRequired,
};

const FirstJoinCommon: React.FC<InferProps<typeof props>> = ({
  navigation,
  route: {
    params: {currCommon, currDaoId, refreshFeed},
  },
}) => {
  const handleContinue = () => {
    const introduceYourselfFormStore = new IntroduceYourselfFormStore();
    const paymentFormStore = new PaymentFormStore();
    const personalContributionFormStore = new PersonalContributionFormStore();
    const billingDetailsFormStore = new BillingDetailsFormStore();

    const navigateIntroductionStep = CommonActions.navigate({
      name: 'IntroductionStep', // we always go to Introduction first
      params: {
        formStores: {
          paymentFormStore,
          introduceYourselfFormStore,
          personalContributionFormStore,
          billingDetailsFormStore,
        },
        currCommon: currCommon,
        currDaoId: currDaoId,
        skipFirstStep: false,
        refreshFeed,
      },
    });
    navigation.dispatch(navigateIntroductionStep);
  };

  return (
    <ScrollView>
      <FastImage
        source={require('~/Assets/headerBg.png')}
        style={styles.backgroundImage}
      />
      <Text style={styles.title}>{'How to \njoin a \ncommon'}</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>
          Introduce yourself and add your personal contribution.
        </Text>
        <FastImage
          source={require('~/Assets/transparentCut.png')}
          style={[styles.cardImage, {alignSelf: 'center'}]}
        />
      </View>
      <View style={styles.card}>
        <FastImage
          source={require('~/Assets/volunteeringCut.png')}
          style={[styles.cardImage]}
        />
        <Text style={styles.cardText}>
          Community members vote to approve your request to join.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Become an equal member with an equal vote.
        </Text>
        <FastImage
          source={require('~/Assets/decentralizedCut.png')}
          style={[styles.cardImage]}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleContinue}>
        <Text style={text.buttoncenterwhite}>Got it</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default observer(FirstJoinCommon);

FirstJoinCommon.propTypes = props;

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    ...font.heading.bold,
    fontSize: 57,
    lineHeight: 57,
    marginHorizontal: 35,
    marginTop: 70,
    marginBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    height: 130,
  },
  cardText: {
    color: colors.black,
    fontSize: 16,
    flex: 3,
    marginHorizontal: 35,
    alignSelf: 'center',
  },
  cardImage: {
    width: 100,
    height: 100,
    flex: 2,
    alignSelf: 'flex-end',
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: 420,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 420,
    zIndex: -1,
  },
  btn: {
    ...layout.btnPrimary,
    width: '85%',
    alignSelf: 'center',
    marginTop: 20,
  },
});

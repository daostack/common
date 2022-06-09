import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {colors, font, layout, text} from '~/Theme';
import {observer} from 'mobx-react';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {
  BillingDetailsFormStore,
  IntroduceYourselfFormStore,
  PaymentFormStore,
  PersonalContributionFormStore,
} from '~/Stores/FormStores/MembershipAdmittance';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import {CommonActions} from '@react-navigation/native';
import {bool, func, InferProps, object, shape, string} from 'prop-types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

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

const {height, width} = Dimensions.get('window');

const FirstJoinCommon: React.FC<InferProps<typeof props>> = ({
  route: {
    params: {currCommon},
  },
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const handleContinue = () => {
    const introduceYourselfFormStore = new IntroduceYourselfFormStore();
    const paymentFormStore = new PaymentFormStore();
    const personalContributionFormStore = new PersonalContributionFormStore();
    const billingDetailsFormStore = new BillingDetailsFormStore();

    const navigateMembershipAdmittance = CommonActions.navigate({
      name: NAVIGATION_SCREENS.MEMBERSHIP_ADMITTANCE,
      params: {
        formStores: {
          paymentFormStore,
          introduceYourselfFormStore,
          personalContributionFormStore,
          billingDetailsFormStore,
        },
        currCommon: currCommon,
        currDaoId: currDaoId,
        refreshFeed,
      },
      currCommon,
      skipFirstStep: false,
    });
    navigation.dispatch(navigateMembershipAdmittance);
  };

  return (
    <ScrollView bounces={false} contentContainerStyle={styles.container}>
      <FastImage
        source={require('~/Assets/headerBg.png')}
        style={styles.backgroundImage}
      />
      <Text style={[styles.title, {marginTop: insets.top + 15}]}>
        {'How to \njoin a \ncommon'}
      </Text>

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
      <TouchableOpacity
        style={[styles.btn, {bottom: insets.bottom + 15}]}
        onPress={handleContinue}>
        <Text style={text.buttoncenterwhite}>Got it</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default observer(FirstJoinCommon);

FirstJoinCommon.propTypes = props;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.white,
    ...font.heading.bold,
    fontSize: 53,
    lineHeight: 57,
    marginHorizontal: 35,
    marginBottom: height * 0.03,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 34,
    marginHorizontal: 20,
    marginVertical: 10,
    height: height * 0.145,
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
    width: width,
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
    position: 'absolute',
    width: '85%',
    alignSelf: 'center',
  },
});

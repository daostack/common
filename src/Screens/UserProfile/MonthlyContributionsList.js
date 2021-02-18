import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {inject, observer} from 'mobx-react';
import {Fade, Placeholder, PlaceholderLine} from 'rn-placeholder';

import {ContributionListItem} from '../../Components';
import {colors, text} from '../../Theme';
import {fontSize} from '~/Theme/font';
import {getUserSubscriptions} from '~/Services/SubscriptionService';
import {authStorePropTypes} from '~/Types/propTypes';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },

  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },

  container: {
    alignItems: 'center',
  },

  title: {
    ...text.h2Black,
  },

  subtitle: {
    ...fontSize(2),
    fontWeight: 'normal',
    textAlign: 'center',
    maxWidth: Dimensions.get('window').width * 0.7,
    marginTop: 10,
  },
});

const MonthlyContributionsList = ({authStore, navigation}) => {
  const [subs, setSubs] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      await getUserSubscriptions(authStore.userInfo.uid, (snap) => {
        setSubs(snap.docs.map((doc) => doc.data()));
      });
    })();
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}>
      {subs === null && (
        <React.Fragment>
          {[1, 1, 1, 1].map((i, index) => (
            <View style={styles.item} key={index}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={20} />
                <PlaceholderLine width={60} />
                <PlaceholderLine width={65} />
                <PlaceholderLine width={10} />
              </Placeholder>
            </View>
          ))}
        </React.Fragment>
      )}

      {subs?.length === 0 && (
        <View style={styles.container}>
          <Image source={require('../../Assets/Subscriptions/funds.png')} />

          <Text style={styles.title}>No Monthly Contributions</Text>

          <Text style={styles.subtitle}>
            You don't have any active monthly contributions yet.
          </Text>
        </View>
      )}

      {!!subs?.length && (
        <React.Fragment>
          {subs.map((subscription, index) => (
            <View style={styles.item} key={index}>
              <ContributionListItem
                subscription={subscription}
                navigation={navigation}
              />
            </View>
          ))}
        </React.Fragment>
      )}
    </ScrollView>
  );
};

MonthlyContributionsList.propTypes = {
  navigation: PropTypes.object,
  authStore: authStorePropTypes,
};

export default inject('authStore')(observer(MonthlyContributionsList));

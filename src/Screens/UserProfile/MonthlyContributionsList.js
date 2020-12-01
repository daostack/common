import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {inject, observer} from 'mobx-react';
import {Fade, Placeholder, PlaceholderLine} from 'rn-placeholder';

import {ContributionListItem} from '../../Components';
import {colors} from '../../Theme';
import {db} from '../../Firebase';

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
});


const MonthlyContributionsList = ({userStore}) => {
  const [subs, setSubs] = React.useState(null);

  React.useEffect(() => {
    const effect = async () => {
      await db
        .collection('subscriptions')
        .where('userId', '==', userStore.userInfo.uid)
        .onSnapshot((snapshot) => {
          setSubs(snapshot.docs.map((doc) => doc.data()));
        });
    };

    effect();
  }, []);


  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
    >
      {(subs === null) && (
        <React.Fragment>
          {[1, 1, 1, 1].map((i, index) => (
            <View style={styles.item} key={index}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={20}/>
                <PlaceholderLine width={60}/>
                <PlaceholderLine width={65}/>
                <PlaceholderLine width={10}/>
              </Placeholder>
            </View>
          ))}

        </React.Fragment>
      )}

      {(subs?.length === 0) && (
        <Text>No subs</Text>
      )}

      {(!!subs?.length) && (
        <React.Fragment>
          {subs.map((subscription, index) => (
            <View style={styles.item} key={index}>
              <ContributionListItem subscription={subscription}/>
            </View>
          ))}
        </React.Fragment>
      )}
    </ScrollView>
  );
};

MonthlyContributionsList.propTypes = {
  navigation: PropTypes.object,

  userStore: PropTypes.shape({
    userInfo: PropTypes.shape({
      uid: PropTypes.string,
      safeAddress: PropTypes.string,
    }),
  }),
};

export default inject(
  'userStore'
)(observer(MonthlyContributionsList));


import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, Text, View, StyleSheet} from 'react-native';

import moment from 'moment';
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
      const commons = await db
        .collection('daos')
        .where('members', 'array-contains', {
          address: userStore.userInfo.safeAddress,
          userId: userStore.userInfo.uid,
        })
        .get();

      const mountlySubs = [];

      for (let commonDoc of commons.docs) {
        const common = commonDoc.data();

        if (common.metadata?.contribution === 'monthly') {
          const proposal = await db
            .collection('proposals')
            .where('dao', '==', common.id)
            .where('type', '==', 'Join')
            .where('proposerId', '==', userStore.userInfo.uid)
            .where('winningOutcome', '==', 1)
            .get();

          // Sometimes if the user created the common
          // there will be no proposal for that
          if (proposal.docs[0]) {
            mountlySubs.push({
              proposal: proposal.docs[0].data(),
              common,
            });
          }
        }
      }

      setSubs(mountlySubs);
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
                <PlaceholderLine width={20} />
                <PlaceholderLine width={60} />
                <PlaceholderLine width={65} />
                <PlaceholderLine width={10} />
              </Placeholder>
            </View>
          ))}

        </React.Fragment>
      )}

      {(subs !== null && !subs.length) && (
        <Text>No subs</Text>
      )}

      {(!!subs?.length) && (
        <React.Fragment>
          {subs.map((data, index) => (
            <View style={styles.item} key={index}>
              <ContributionListItem
                active
                amount={data.proposal.description.funding / 100}
                dueDate={moment(data.proposal.executedAt).toDate()}
                proposalId={data.proposal.id}
                commonName={data.common.metadata.name}
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

  userStore: PropTypes.shape({
    userInfo: PropTypes.shape({
      uid: PropTypes.string,
      safeAddress: PropTypes.string,
    }),
  }),
};

export default inject(
  'userStore',
)(observer(MonthlyContributionsList));


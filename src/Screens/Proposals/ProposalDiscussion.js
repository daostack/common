import React, {useState, useEffect, useRef} from 'react';
import {Text, StyleSheet, SectionList, View, ScrollView, Image} from 'react-native';
import {text, colors, font} from '~/Theme';
import DiscussionMessage from '../Discussions/DiscussionMessage';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import {db} from '../../Firebase';
import logger from '../../Services/Logger';
import PropTypes, {string} from 'prop-types';

const ProposalDiscussion = ({proposalId, scrollViewRef}) => {
  const chatRef = useRef(null);
  const [msgGroups, setMsgGroups] = useState([]);

  const setMsgGroup = (msgGroup) => {
    setMsgGroups(msgGroup);

    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({
        animated: true,
      });
    }, 150)
  };

  let listRef = useRef([]);
  useEffect(() => {
    const unsubscribe = db.collection('discussionMessage')
      .where('discussionId', '==', proposalId)
      .orderBy('createTime', 'desc')
      // .startAt(0)
      // .limit(25)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.docChanges().length !== 0) {
            const newList = snapshot.docChanges().map(({doc}) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const msgList = [...newList, ...listRef.current];
            // _.union(listRef.current, newList);
            listRef.current = msgList;
            logger.log('newMessage', newList);
            const groupDate = msgList
              .map((msg) => ({
                date: moment(msg.createTime.toDate()).format('YYYY-MM-DD'),
                data: msg,
              }))
              .reduce((acc, curr) => {
                var key = curr.date;
                let el = acc.find((x) => x && x.date === key);
                if (el) {
                  el.data.push(curr.data);
                } else {
                  acc.push({
                    date: key,
                    data: [curr.data],
                  });
                }
                return acc;
              }, []);
            logger.log('groupDate', groupDate);
            setMsgGroup(groupDate);

            scrollViewRef.current.scrollToEnd({
              animated: true,
            });

            chatRef.current.scrollToLocation({
              animated: true,
              itemIndex:  7,
              sectionIndex: groupDate.length - 1,
            });
          }
        },
        (error) => logger.error(error),
      );
    return () => {
      unsubscribe();
    };
  }, [proposalId]);

  return (
    <View style={{flex: 1, backgroundColor: colors.paleGrey}}>
      <ScrollView
        style={{flex: 1}}
        // contentContainerStyle={{paddingBottom: 120}}
      >
        {msgGroups.length > 0 ? (
          <SectionList
            inverted
            ref={chatRef}
            sections={msgGroups}
            keyExtractor={(x) => x.id}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={{
              paddingTop: 100,
            }}

            renderItem={(x) => (
              <DiscussionMessage data={x.item} />
            )}

            onScrollToIndexFailed={() => {
              console.log('not cool');
            }}

            renderSectionFooter={({section: {date}}) => (
              <Text style={styles.timeHeader}>
                {moment().isSame(date, 'day') ? 'Today' : date}
              </Text>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require('~/Assets/empty-discussion.png')}
              style={{
                width: 240,
                height: 240,
              }}
            />

            <Text style={styles.emptyTitle}>
              No comments yet
            </Text>
            <Text style={styles.emptyBody}>
              Have any thoughts? Share them with other members by adding the first comment.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
  // <Text style={styles.title}>Proposal Discussion</Text>;
};

ProposalDiscussion.propTypes = {
  proposalId: string,
  scrollViewRef: PropTypes.any,
};

const styles = StyleSheet.create({
  title: {
    ...text.h3Black,
  },
  timeHeader: {
    textAlign: 'center',
    marginVertical: 3,
    color: colors.grey3,
    ...font.fontSize(2),
    ...font.primary.regular,
  },
  emptyContainer: {
    flex: 0.8,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...font.fontSize(3),
    ...font.primary.bold,
    paddingVertical: 12,
  },
  emptyBody: {
    textAlign: 'center',
    ...font.fontSize(2),
    ...font.primary.regular,
  },
});

export default inject('userStore')(observer(ProposalDiscussion));

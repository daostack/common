import React, {useState, useEffect, useRef} from 'react';
import {Text, StyleSheet, SectionList, View, Image, Dimensions} from 'react-native';
import {layout, text, colors, font} from '~/Theme';
import DiscussionMessage from '../Discussions/DiscussionMessage';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import {db} from '../../Firebase';
import logger from '../../Services/Logger';
import PropTypes, {string, func} from 'prop-types';
import UserService from '../../Services/UserService';

const ProposalDiscussion = ({proposal, proposalId, scrollViewRef}) => {
  const chatRef = useRef(null);
  const [msgGroups, setMsgGroups] = useState([]);

  const setMsgGroup = (msgGroup) => {
    setMsgGroups(msgGroup);

    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({
        animated: true,
      });
    }, 150);
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

            setMsgGroup(groupDate);


            chatRef.current.scrollToLocation({
              animated: true,
              itemIndex: msgList.length + groupDate.length - 1,
            });
          }
        },
        (error) => logger.error(error)
      );
    return () => {
      unsubscribe();
    };
  }, [proposalId]);

  const getOutcomeForMessage = async (proposal, message) => {
    const user = await UserService.getInstance().getUserById(message.ownerId);

    // console.log(proposal, message, !!proposal?.votes.find((y) => y.voter === user.safeAddress).outcome);

    return proposal?.votes.find((y) => y.voter === user.safeAddress).outcome === 1;
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.paleGrey, ...layout.content}}>
      {msgGroups.length > 0 ? (
        <SectionList
          inverted
          ref={chatRef}
          sections={msgGroups}
          keyExtractor={(x) => x.id}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{
            paddingTop: 100,
            width: Dimensions.get('screen').width * 0.9,
          }}

          renderItem={(x) => (
            <DiscussionMessage
              data={x.item}
              showCurrentUserAvatar
              outcome={getOutcomeForMessage(proposal, x.item)}
            />
          )}

          onScrollToIndexFailed={(info) => {
            logger.error('Something bad happened: ', info);
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
    </View>
  );
};

ProposalDiscussion.propTypes = {
  proposalId: string,
  scrollViewRef: PropTypes.any,
  onFirstScrollDown: func,
  onScrollRefresh: func,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
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

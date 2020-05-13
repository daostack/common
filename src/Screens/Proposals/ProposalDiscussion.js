import React, {useState, useEffect, useRef} from 'react';
import {Text, StyleSheet, SectionList, View, ScrollView} from 'react-native';
import {text, colors} from '../../Theme';
import DiscussionMessage from '../Discussions/DiscussionMessage';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

const ProposalDiscussion = props => {
  const chatRef = useRef(null);
  const [msgGroup, setMsgDroup] = useState([]);

  const inputRef = props.inputRef;

  const commonId = '48NPcGnpskN9YkqVNXKA';
  const proposalId = 'DmZFnbSbkwcQHMAyGa54';
  const discussionId = '43Q9abICrp2KpE86c1Az';

  let listRef = useRef([]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('common')
      .doc(commonId)
      .collection('proposal')
      .doc(proposalId)
      .collection('discussion')
      .doc(discussionId)
      .collection('message')
      .orderBy('createTime', 'desc')
      // .startAt(0)
      // .limit(25)
      .onSnapshot(
        snapshot => {
          if (snapshot.docChanges().length !== 0) {
            const newList = snapshot.docChanges().map(({doc}) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const msgList = [...newList, ...listRef.current];
            // _.union(listRef.current, newList);
            listRef.current = msgList;
            console.log('newMessage', newList);
            const groupDate = msgList
              .map(msg => ({
                date: moment(msg.createTime.toDate()).format('YYYY-MM-DD'),
                data: msg,
              }))
              .reduce((acc, curr) => {
                var key = curr.date;
                let el = acc.find(x => x && x.date === key);
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
            console.log('groupDate', groupDate);
            setMsgDroup(groupDate);
            chatRef.current.scrollToLocation({
              animated: true,
              itemIndex: 0,
              sectionIndex: 0,
            });
          }
        },
        error => console.error(error),
      );
    return () => {
      unsubscribe();
    };
  }, [commonId, proposalId, discussionId]);

  return (
    <View style={{flex: 1, backgroundColor: colors.lightBlue}}>
      {/* <ChatRoom
        path={`common/${commonId}/proposal/${proposalId}/discussion/${discussionId}/message`}
      /> */}
      <ScrollView style={{flex: 1}}>
        <SectionList
          sections={msgGroup}
          ref={chatRef}
          // ListFooterComponent={header}
          renderItem={x => <DiscussionMessage data={x.item} />}
          renderSectionFooter={({section: {date}}) => (
            <Text style={styles.timeHeader}>
              {moment().isSame(date, 'day') ? 'Today' : date}
            </Text>
          )}
          keyExtractor={x => x.id}
          stickySectionHeadersEnabled={true}
          inverted={true}
          contentContainerStyle={{paddingTop: 100}}
          // initialScrollIndex={2}
        />
      </ScrollView>
    </View>
  );
  // <Text style={styles.title}>Proposal Discussion</Text>;
};

const styles = StyleSheet.create({
  title: {
    ...text.h3Black,
  },
  timeHeader: {
    textAlign: 'center',
    marginVertical: 3,
    color: colors.grey3,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
});

export default inject('userStore')(observer(ProposalDiscussion));

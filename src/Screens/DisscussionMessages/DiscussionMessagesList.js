import React, {useRef, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  SectionList,
  View,
  Image,
  Dimensions,
} from 'react-native';
import {layout, text, colors, font} from '~/Theme';
import DiscussionMessage from '../Discussions/DiscussionMessage';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import logger from '../../Services/Logger';
import PropTypes, {string, bool, func} from 'prop-types';
import {discussionStorePropTypes} from '~/Types/propTypes';
import {rootStorePropTypes} from '~/Types/propTypes';

const DiscussionMessagesList = ({
  discussionId,
  scrollViewRef,
  rootStore,
  hasPermission,
  commonId,
  openMessageOptions,
  isMember,
}) => {
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 150);
  }, []);

  const chatRef = useRef(null);
  const discussionMessageStore = rootStore.discussionMessageStore;
  const msgGroups = discussionMessageStore
    .getDiscussionMessagesByDiscussionId(discussionId)
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

  return (
    <View
      style={{flex: 1, backgroundColor: colors.paleGrey, ...layout.content}}>
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
              hasPermission={hasPermission}
              commonId={commonId}
              openMessageOptions={() => openMessageOptions(x.item)}
              isMember={isMember}
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

          <Text style={styles.emptyTitle}>No comments yet</Text>
          <Text style={styles.emptyBody}>
            Have any thoughts? Share them with other members by adding the first
            comment.
          </Text>
        </View>
      )}
    </View>
  );
};

DiscussionMessagesList.propTypes = {
  discussionId: string,
  scrollViewRef: PropTypes.any,
  discussionMessageStore: discussionStorePropTypes,
  rootStore: rootStorePropTypes.isRequired,
  hasPermission: bool,
  commonId: string,
  action: func,
  openMessageOptions: func,
  isMember: bool,
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

export default inject('rootStore')(observer(DiscussionMessagesList));

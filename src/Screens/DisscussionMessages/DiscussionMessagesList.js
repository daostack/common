import React, {useRef} from 'react';
import {
  Text,
  StyleSheet,
  SectionList,
  View,
  Image,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {layout, text, colors, font} from '~/Theme';
import DiscussionMessageItem from '../Discussions/DiscussionMessageItem';
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
  const chatRef = useRef(null);
  const discussionMessageStore = rootStore.discussionMessageStore;

  const viewerPermission = rootStore.authStore.getPermission(
    commonId,
    auth()?.currentUser?.uid,
  );

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

  setTimeout(() => {
    // Sometimes that code is executed after we leave the actual screen, so we need that check.
    if (scrollViewRef?.current) {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }
  }, 150);

  return (
    <View style={styles.viewContainer}>
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
          renderItem={({item: discussionMessage}) => (
            <DiscussionMessageItem
              data={discussionMessage}
              showCurrentUserAvatar
              hasPermission={hasPermission}
              viewerPermission={viewerPermission}
              commonId={commonId}
              openMessageOptions={() => openMessageOptions(discussionMessage)}
              isMember={isMember}
            />
          )}
          onScrollToIndexFailed={(info) => {
            logger.error('Something bad happened: ', info);
          }}
          renderSectionFooter={({section: {date}}) => (
            <View style={styles.timeHeaderContainer}>
              <Text style={styles.timeHeader}>
                {moment().isSame(date, 'day') ? 'Today' : date}
              </Text>
            </View>
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
  hasPermission: string,
  commonId: string,
  action: func,
  openMessageOptions: func,
  isMember: bool,
};

const styles = StyleSheet.create({
  title: {
    ...text.h3Black,
  },
  timeHeaderContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 20,
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
  viewContainer: {
    flex: 1,
    backgroundColor: colors.paleLilacTwo,
    ...layout.content,
  },
});

export default inject('rootStore')(observer(DiscussionMessagesList));

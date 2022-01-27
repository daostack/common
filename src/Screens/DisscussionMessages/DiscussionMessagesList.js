import auth from '@react-native-firebase/auth';
import {observer} from 'mobx-react-lite';
import moment from 'moment';
import PropTypes, {bool, func, string} from 'prop-types';
import React, {useRef} from 'react';
import {Image, SectionList, StyleSheet, Text, View} from 'react-native';
import {colors, font, text} from '~/Theme';
import {discussionStorePropTypes} from '~/Types/propTypes';
import logger from '../../Services/Logger';
import DiscussionMessage from '../Discussions/DiscussionMessage';
import {useStore} from '~/Util/hooks/useStore';

const DiscussionMessagesList = ({
  discussionId,
  scrollViewRef,
  hasPermission,
  commonId,
  openMessageOptions,
  isMember,
  inputHeight,
}) => {
  const chatRef = useRef(null);
  const rootStore = useStore('rootStore');
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
      const key = curr.date;
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
    <View style={[styles.viewContainer]}>
      {msgGroups.length > 0 ? (
        <SectionList
          inverted
          ref={chatRef}
          sections={msgGroups}
          keyExtractor={(x) => x.id}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{
            paddingTop: 16,
          }}
          renderItem={(x) => (
            <DiscussionMessage
              data={x.item}
              showCurrentUserAvatar
              hasPermission={hasPermission}
              viewerPermission={viewerPermission}
              commonId={commonId}
              openMessageOptions={() => openMessageOptions(x.item)}
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
  hasPermission: string,
  commonId: string,
  action: func,
  openMessageOptions: func,
  isMember: bool,
  inputHeight: string,
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
    marginTop: 16,
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
    paddingHorizontal: 6,
    zIndex: -1,
  },
});

export default observer(DiscussionMessagesList);

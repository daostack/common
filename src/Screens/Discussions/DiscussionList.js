import React, {useEffect} from 'react';
import {inject, observer} from 'mobx-react';
import {FlatList} from 'react-native';
import DiscussionCard from './DiscussionCard';
import ViewTabNoData from '~/Components/ViewTabNoData';
import {string, object, bool, func} from 'prop-types';
import {rootStorePropTypes} from '~/Types/propTypes';

const DiscussionList = ({
  commonId,
  navigation,
  rootStore,
  openCommonOptions,
  showHiddenNote,
  isMember,
}) => {
  const list = rootStore.discussionStore.getCommonDiscussions(commonId);

  useEffect(() => {
    const unsubscribeFromDiscussionMessages = rootStore.discussionMessageStore.subscribeToDiscussionsMessages(
      list.map((discussion) => discussion.id),
    );
    return () => {
      unsubscribeFromDiscussionMessages &&
        unsubscribeFromDiscussionMessages.map((unsubscribeFromChunk) =>
          unsubscribeFromChunk(),
        );
    };
  }, [list]);

  return (
    <>
      {list?.length > 0 ? (
        <FlatList
          data={list}
          renderItem={({item}) => (
            <DiscussionCard
              key={item.id}
              data={item}
              commonId={commonId}
              navigation={navigation}
              openCommonOptions={() => openCommonOptions(item)}
              hiddenDiscussionNote={() => showHiddenNote(item)}
              isMember={isMember}
            />
          )}
        />
      ) : (
        <ViewTabNoData
          title="No Discussions"
          subtitle="This is where you can discuss and share your thoughts and ideas."
        />
      )}
    </>
  );
};

DiscussionList.propTypes = {
  commonId: string.isRequired,
  navigation: object.isRequired,
  openCommonOptions: func,
  showHiddenNote: func,
  rootStore: rootStorePropTypes,
  isMember: bool,
};

export default inject('rootStore')(observer(DiscussionList));

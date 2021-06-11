import React, {useState, useEffect} from 'react';
import {inject, observer} from 'mobx-react';
import {FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';
import DiscussionCard from './DiscussionCard';
import ViewTabNoData from '~/Components/ViewTabNoData';
import {string, object, bool, func} from 'prop-types';
import {rootStorePropTypes} from '~/Types/propTypes';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';

const DiscussionList = ({
  commonId,
  navigation,
  rootStore,
  openCommonOptions,
  showHiddenNote,
  isMember,
}) => {
  const [page, setPage] = useState(0);
  const list = rootStore.discussionStore.commonDiscussions;
  const viewerPermission = rootStore.authStore.getPermission(
    commonId,
    auth()?.currentUser?.uid,
  );
  const isModerator = viewerPermission === PERMISSIONS.MODERATOR;

  useEffect(() => {
    rootStore.discussionStore.loadCommonDiscussions(commonId);
  }, []);

  async function loadMoreDiscussions() {
    await rootStore.discussionStore.loadCommonDiscussions(commonId, page);
    setPage(page + 1);
  }

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
              hiddenDiscussionNote={() =>
                showHiddenNote({hiddenItem: item, isModerator})
              }
              isMember={isMember}
              viewerPermission={viewerPermission}
              // onEndReachedThreshold={0}
              onEndReached={loadMoreDiscussions}
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

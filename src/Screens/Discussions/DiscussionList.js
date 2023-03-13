import React, {useCallback} from 'react';
import {observer} from 'mobx-react';
import {FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';
import DiscussionCard from './DiscussionCard';
import ViewTabNoData from '~/Components/ViewTabNoData';
import {string, bool, func} from 'prop-types';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import {useStore} from '~/Util/hooks/useStore';

const DiscussionList = ({
  commonId,
  openCommonOptions,
  showHiddenNote,
  isMember,
}) => {
  const rootStore = useStore('rootStore');
  const discussionStore = useStore('discussionStore');
  const list = discussionStore.getCommonDiscussions(commonId);
  const viewerPermission = rootStore.authStore.getPermission(
    commonId,
    auth()?.currentUser?.uid,
  );
  const isModerator = viewerPermission === PERMISSIONS.MODERATOR;

  const keyExtractor = useCallback((data) => data.id, []);

  return (
    <>
      {list?.length > 0 ? (
        <FlatList
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          listKey="DiscussionList"
          data={list}
          keyExtractor={keyExtractor}
          renderItem={({item}) => (
            <DiscussionCard
              key={item.id}
              data={item}
              commonId={commonId}
              openCommonOptions={() => openCommonOptions(item)}
              hiddenDiscussionNote={() =>
                showHiddenNote({hiddenItem: item, isModerator})
              }
              isMember={isMember}
              viewerPermission={viewerPermission}
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
  openCommonOptions: func,
  showHiddenNote: func,
  isMember: bool,
};

export default observer(DiscussionList);

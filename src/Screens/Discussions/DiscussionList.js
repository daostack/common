import React, {useState, useEffect} from 'react';
import {inject, observer} from 'mobx-react';
import {FlatList} from 'react-native';
import auth from '@react-native-firebase/auth';
import DiscussionCard from './DiscussionCard';
import ViewTabNoData from '~/Components/ViewTabNoData';
import {string, object, bool, func} from 'prop-types';
import {rootStore as rootStoreType} from '~/Types/store';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';

const DiscussionList = ({
  commonId,
  navigation,
  rootStore,
  openCommonOptions,
  showHiddenNote,
  isMember,
}) => {
  const list = rootStore.discussionStore.commonDiscussions;

  const [viewerPermission, setViewerPermission] = useState();
  useEffect(() => {
    (async () => {
      const permission = await rootStore.authStore.getPermission(
        commonId,
        auth()?.currentUser?.uid,
      );
      setViewerPermission(permission);
    })();
  }, [commonId]);

  const isModerator = viewerPermission === PERMISSIONS.MODERATOR;

  useEffect(() => {
    rootStore.discussionStore.loadCommonDiscussions(commonId);
  }, []);

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
  rootStore: rootStoreType,
  isMember: bool,
};

export default inject('rootStore')(observer(DiscussionList));

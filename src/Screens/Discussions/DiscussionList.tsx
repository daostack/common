import auth from '@react-native-firebase/auth';
import {observer} from 'mobx-react';
import React, {useCallback} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import ViewTabNoData from '~/Components/ViewTabNoData';
import {Discussion} from '~/Stores/Models/Discussion';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import {useStore} from '~/Util/hooks/useStore';
import {DiscussionCard} from './DiscussionCard';

interface DiscussionListProps {
  commonId: string;
  openCommonOptions: (item: Discussion) => void;
  showHiddenNote: ({hiddenItem, isModerator}) => void;
  isMember: boolean;
}

export const DiscussionList = observer((props: DiscussionListProps) => {
  const {commonId, openCommonOptions, showHiddenNote, isMember} = props;
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
          contentContainerStyle={styles.flatListContainer}
          renderItem={({item}) => (
            <DiscussionCard
              key={item.id}
              data={item}
              commonId={commonId}
              openCommonOptions={() => openCommonOptions(item)}
              hiddenDiscussionNote={() => {
                showHiddenNote({hiddenItem: item, isModerator});
              }}
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
});

const styles = StyleSheet.create({
  flatListContainer: {
    paddingTop: 24,
  },
});

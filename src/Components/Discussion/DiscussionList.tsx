import React from 'react';
import {observer} from 'mobx-react';
import {FlatList} from 'react-native';
import {DiscussionCard} from './DiscussionCard';
import ViewTabNoData from '~/Components/ViewTabNoData';
import {useStore} from '~/Stores';
import {Common} from '~/Stores/Models';

export const DiscussionList: React.FC<{
  common: Common;
}> = observer(({common}) => {
  const {discussionStore} = useStore();
  const list = discussionStore.getCommonDiscussions(common.id);
  return (
    <>
      {list.length > 0 ? (
        <FlatList
          data={list}
          renderItem={({item}) => (
            <DiscussionCard key={item.id} discussion={item} common={common} />
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

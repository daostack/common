import React, {useEffect, useState, useRef} from 'react';
import {inject, observer} from 'mobx-react';
import {FlatList} from 'react-native';
import DiscussionCard from './DiscussionCard';
import ViewTabNoData from '~/Components/ViewTabNoData';
import {string, object, shape, func} from 'prop-types';
import {db} from '~/Firebase';
import logger from '~/Services/Logger';

const DiscussionList = ({commonId, navigation, discussionStore}) => {
  const list = discussionStore.getCommonDiscussions(commonId);

  // let listRef = useRef([]);
  // useEffect(() => {
  //   const unsubscribe = db
  //     .collection('discussion')
  //     .where('commonId', '==', commonId)
  //     .orderBy('lastMessage', 'desc')
  //     .onSnapshot(
  //       (snapshot) => {
  //         if (snapshot.empty) {
  //           setList([]);
  //         } else {
  //           if (snapshot.docChanges().length !== 0) {
  //             let newList = [];
  //             snapshot.forEach((doc) => {
  //               newList.push({
  //                 id: doc.id,
  //                 ...doc.data(),
  //               });
  //             });
  //             listRef.current = newList;
  //             setList(listRef.current);
  //           }
  //         }
  //       },
  //       // TOOD: please do not silence any errors like this
  //       (error) => logger.error(error),
  //     );
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [commonId]);

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
  discussionStore: shape({
    getCommonDiscussions: func,
  }),
};

export default inject('discussionStore')(observer(DiscussionList));

import React, {useEffect, useState, useRef} from 'react';
import {FlatList} from 'react-native';
import DiscussionCard from './DiscussionCard';
import ViewTabNoData from '../../Components/ViewTabNoData';
import {string, object} from 'prop-types';
import { db } from '../../Firebase';

const DiscussionList = ({commonId, navigation}) => {
  const [list, setList] = useState([]);

  let listRef = useRef([]);
  useEffect(() => {
    const unsubscribe = db
      .collection('discussion')
      .where('commonId', '==', commonId)
      .orderBy('createTime', 'desc')
      .onSnapshot(
        snapshot => {
          if (snapshot.empty) {
            setList([]);
          } else {
            if (snapshot.docChanges().length !== 0) {
              const newList = snapshot.docChanges().map(({doc}) => ({
                id: doc.id,
                ...doc.data(),
              }));
              let createList = newList
                .map(item => {
                  let index = listRef.current.findIndex(v => v.id === item.id);
                  if (index > -1) {
                    listRef.current[index] = item;
                  } else {
                    return item;
                  }
                })
                .filter(item => item);
              if (createList.length > 0) {
                const allList = [...createList, ...listRef.current];
                listRef.current = allList;
              }
              setList(listRef.current);
            }
          }
        },
        // TOOD: please do not silence any errors like this
        error => console.error(error),
      );
    return () => {
      unsubscribe();
    };
  }, [commonId]);

  return (
    <>
      {list.length > 0 ? (
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
          extraData={listRef}
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
};

export default React.memo(DiscussionList);

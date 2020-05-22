import React, {useEffect, useState, useRef} from 'react';
import {FlatList} from 'react-native';
import DiscussionCard from './DiscussionCard';
import firestore from '@react-native-firebase/firestore';
import ViewTabNoData from '../../Components/ViewTabNoData';

const DiscussionList = props => {
  const commonId = props.commonId;
  const [list, setList] = useState([]);

  console.log('commonId', commonId);

  let listRef = useRef([]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('discussion')
      .where('commonId', '==', commonId)
      // .orderBy('createTime', 'desc')
      .onSnapshot(
        snapshot => {
          console.log('snapshot', snapshot);
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
              console.log('DiscussionList', listRef.current);
            }
          }
        },
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
              commonId={props.commonId}
              navigation={props.navigation}
            />
          )}
          extraData={listRef}
        />
      ) : (
        <ViewTabNoData
          title="No Discussions"
          subtitle="Have things in common? This is the place to talk about them."
        />
      )}
    </>
  );
};

export default DiscussionList;

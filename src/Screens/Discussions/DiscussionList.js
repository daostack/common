import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import DiscussionCard from './DiscussionCard';
import firestore from '@react-native-firebase/firestore';
import ViewTabNoData from '../../Components/ViewTabNoData';
import _ from 'lodash';

const DiscussionList = props => {
  const commonId = props.commonId;
  const [list, setList] = useState([]);

  let listRef = useRef([]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('common')
      .doc(commonId)
      .collection('discussion')
      .orderBy('createTime', 'desc')
      .onSnapshot(
        snapshot => {
          if (snapshot.docChanges().length !== 0) {
            const newList = snapshot.docChanges().map(({doc}) => ({
              id: doc.id,
              ...doc.data(),
            }));
            let createList = newList
              .map(item => {
                let index = listRef.current.findIndex(v => v.id === item.id);
                if (index > -1) {
                  console.log('A', index, item);
                  listRef.current[index] = item;
                } else {
                  console.log('B');
                  return item;
                }
              })
              .filter(item => item);
            if (createList.length > 0) {
              const allList = [...createList, ...listRef.current];
              listRef.current = allList;
            }
            console.log('createList', createList);
            console.log('allList', listRef.current);
            setList(listRef.current);
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey4,
    borderRadius: 8,
    marginHorizontal: 25,
    marginVertical: 10,
    padding: 10,
  },
});

export default DiscussionList;

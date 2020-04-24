import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import DiscussionCard from './DiscussionCard';
import firestore from '@react-native-firebase/firestore';
import ViewTabNoData from '../../Components/ViewTabNoData';

const DiscussionList = props => {
  const commonId = props.commonId;
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchList = async () => {
      const snapshot = await firestore()
        .collection('common')
        .doc(commonId)
        .collection('discussion')
        .orderBy('createTime', 'desc')
        .get();
      setList(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    };
    fetchList();
  }, [commonId]);

  return (
    <>
      {list.length > 0 ? (
        list.map(x => (
          <DiscussionCard
            key={x.id}
            data={x}
            commonId={props.commonId}
            navigation={props.navigation}
          />
        ))
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

import React, {useCallback, useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {PROPOSAL_STATE, PROPOSAL_TYPE} from '~/Config';
import {WhitePaperHeader} from './components/WhitePaperHeader';

const WhitePaper = () => {
  const route = useRoute();
  const {currCommon} = route.params;
  return (
    <View>
      <WhitePaperHeader common={currCommon}/>
    </View>
  );
};

export default WhitePaper;

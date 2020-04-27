import React, {useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

let {height, width} = Dimensions.get('window');
const mockData = {
  data: 'data',
};

const ProposalDiscussion = ({navigation}) => {
  return <Text>Proposal Discussion</Text>;
};

const styles = StyleSheet.create({
  tabStyle: {
    ...text.ashleyjquimbacom2,
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,

    color: colors.mainBlue,
  },

  actionButtonContainer: {
    padding: 20,
    position: 'absolute',
    bottom: -80,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey2,
  },
});

export default ProposalDiscussion;

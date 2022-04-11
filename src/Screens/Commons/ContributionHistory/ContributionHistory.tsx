import {useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ContributionHistoryRouteProps} from '~/Types/navigation';

const ContributionHistory = () => {
  const navigation = useNavigation();
  const route = useRoute<ContributionHistoryRouteProps>();
  const {commonName} = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: commonName,
    });
  }, [commonName]);

  return <View />;
};

export default observer(ContributionHistory);

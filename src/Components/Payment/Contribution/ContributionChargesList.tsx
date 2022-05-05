import {observer} from 'mobx-react';
import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {Subscription} from '~/Stores/Models/Subscription';
import {ContributionChargesItem} from './ContributionChargesItem';

interface Props {
  subscriptions?: Subscription[];
}

export const ContributionChargesList = observer(({subscriptions}: Props) => {
  const keyExtractor = useCallback((data) => data.id, []);

  return (
    <FlatList
      data={subscriptions}
      keyExtractor={keyExtractor}
      initialNumToRender={5}
      maxToRenderPerBatch={8}
      renderItem={({item}: {item: Subscription}) => (
        <ContributionChargesItem amount={item.amount} date={item.createdAt} />
      )}
    />
  );
});

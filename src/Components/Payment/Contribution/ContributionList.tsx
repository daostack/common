import {observer} from 'mobx-react';
import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {Payment} from '~/Stores/Models/Payment';
import {ContributionItem} from './ContributionItem';

interface Props {
  payments?: Payment[];
}

export const ContributionList = observer(({payments}: Props) => {
  const keyExtractor = useCallback((data) => data.id, []);

  return (
    <FlatList
      data={payments}
      keyExtractor={keyExtractor}
      initialNumToRender={5}
      maxToRenderPerBatch={8}
      renderItem={({item}: {item: Payment}) => (
        <ContributionItem
          amount={item.amount.amount}
          createdAt={item.createdAt}
        />
      )}
    />
  );
});

import {observer} from 'mobx-react-lite';
import React, {ReactElement, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Card} from '~/Stores/Models/Card';
import {colors, font} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';
import {CardItem} from './CardItem';

interface Props {
  handleSelectCard: (card: Card) => void;
}

export const CardList = observer(
  ({handleSelectCard}: Props): ReactElement => {
    const {
      authStore: {userInfo},
      cardStore,
    } = useStore('rootStore');

    const currCard = cardStore.getCurrentCard(userInfo?.uid);

    useEffect(() => {
      let unsubscribeFromCard = null;
      if (userInfo?.uid) {
        unsubscribeFromCard = cardStore.subscribeToUserCards(userInfo?.uid);
      }
      return () => {
        unsubscribeFromCard && unsubscribeFromCard();
      };
    }, [userInfo]);

    //const keyExtractor = useCallback((data) => data.id, []);

    return (
      <View>
        <CardItem handleSelectCard={handleSelectCard} card={currCard} />
        {/*<FlatList
            data={cards}
            keyExtractor={keyExtractor}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            renderItem={({item}: {item: Card}) => (
              <CardItem handleSelectCard={handleSelectCard} card={item} />
            )}
          />*/}
      </View>
    );
  },
);

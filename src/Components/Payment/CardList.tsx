import {observer} from 'mobx-react-lite';
import React, {ReactElement, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Card} from '~/Stores/Models/Card';
import {colors, font} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';
import {CardItem} from './CardItem';

interface Props {
  //handleSelectCard: (card: Card) => void;
  navigation: any;
}

export const CardList = observer(
  ({navigation}: Props): ReactElement => {
    const {
      authStore: {userInfo},
      cardStore,
    } = useStore('rootStore');

    const currCard = cardStore.getCurrentCard(userInfo?.uid);

    const replacePaymentMethod = () => {
      navigation.navigate('ChoosePaymentMethodStep');
    };

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
      <CardItem replacePaymentMethod={replacePaymentMethod} card={currCard} />
    );
  },
);

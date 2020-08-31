import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonBox } from '~/Components';
import { inject, observer } from 'mobx-react';
import SwiperCard from '~/Components/SwiperCard';
import DaoService from '~/Services/DaoService';
import { layout, text, font, sizeXXL, colors } from '~/Theme';
import {
  Placeholder,
  PlaceholderMedia,
  Fade,
} from 'rn-placeholder';
import { isDaoMemberBySafeAddress } from '~/Util';

const { width } = Dimensions.get('window');
const DEFAULT_HEADER_HEIGHT = 145;

const CommonsSwiper = ({
  navigation,
  daoStore,
  safeAddress,
  userId,
  onCountChange,
  showMax,
}) => {
  const [myDaos, setMyDaos] = useState(myDaos);
  const [headerHeight, setHeaderHeight] = useState(DEFAULT_HEADER_HEIGHT);
  let listRef = useRef([]);

  const loadMydaos = (snapshot) => {
    if (snapshot.empty) {
      listChangeCallback([]);
    } else {
      if (snapshot.docChanges().length !== 0) {
        const newList = snapshot.docChanges().map(({ doc }, index) => {
          const isMember = isDaoMemberBySafeAddress(doc.data().members, safeAddress);
          if (!isMember) {
            return false;
          }
          return {
            id: doc.id,
            ...doc.data(),
            ...{
              coverPhoto: doc.data().metadata?.image || `https://picsum.photos/id/${index *
                10}/500/100.jpg`,
            },
          };
        });

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
        listChangeCallback(listRef.current);
      }
    }
  };

  useEffect(() => {
    let unsubscribe = null;
    const getMyDaos = async () => {
      unsubscribe = await DaoService.getInstance().subscribeToMyDaosList(userId, safeAddress, loadMydaos);
    };

    getMyDaos();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [safeAddress]);

  const setDao = dao => {
    // TODO: Remove it
    daoStore.setDao(dao);
  };

  const headerHeightLayouted = height => {
    setHeaderHeight(height);
  };

  const renderCommonCard = (item, index) => {
    return (
      !showMax || (index < showMax) ? <CommonBox
        key={item.id}
        width={width - 60}
        common={item}
        navigation={navigation}
        onPress={() => setDao(item)}
        headerHeightLayouted={headerHeightLayouted}
      /> : <TouchableOpacity onPress={() => navigation.navigate('MyCommons')} style={{ ...styles.commonBox, height: headerHeight }}>
          <Text style={text.buttonblue}>{`View all ${myDaos.length} Commons`}</Text>
        </TouchableOpacity>
    );
  };

  const listChangeCallback = newList => {
    setMyDaos(newList);
    if (onCountChange) {
      onCountChange(newList.length);
    }
  };

  return myDaos ? (
    myDaos.length > 0 ? (
      <View style={layout.flexRow}>
        <View style={layout.flexRow}>
          <SwiperCard
            cardRenderer={(item, index) => renderCommonCard(item, index)}
            data={myDaos}
            extraData={listRef}
            showMax={showMax}
          />
        </View>
      </View>
    ) : (
        <View style={styles.emptyObjectContainer}>
          <Image
            style={{ height: 120, width: 120 }}
            source={require('../../../src/Assets/group.png')}
          />
          <Text style={{ ...text.h2Black, ...layout.marginTopS }}>No Commons</Text>
          <Text
            style={styles.textNoCommons}>
            Join your first common and start making an impact
        </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate('Explore')}>
              <Text style={text.buttonblue}>Explore Commons</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
  ) : (
      <View style={{ paddingHorizontal: 20 }}>
        <Placeholder Animation={Fade}>
          <PlaceholderMedia
            style={{
              height: 200,
              width: '100%',
              marginBottom: 20,
              borderRadius: 26,
            }}
          />
        </Placeholder>
      </View>
    );
};

const styles = StyleSheet.create({
  emptyObjectContainer: {
    ...layout.content,
    borderRadius: 14,
    backgroundColor: colors.iceBlue,
    alignSelf: 'center',
  },

  textNoCommons: {
    ...font.primary.regular,
    ...font.fontSize(2),
    ...text.centered,
    ...layout.marginTopS,
  },

  btn: {
    ...layout.btnOutline,
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: colors.white,
    flexGrow: 0,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  commonBox: {
    width: '100%',
    // height: 137,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 26, 54, 0.08)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 6,
  },
});

export default inject(
  'daoStore',
)(observer(CommonsSwiper));

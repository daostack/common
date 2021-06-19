import React, {useState} from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {CommonBox} from '~/Components';
import SwiperCard from '~/Components/SwiperCard';
import {layout, text, font, colors} from '~/Theme';
import {Placeholder, PlaceholderMedia, Fade} from 'rn-placeholder';
import {CommonActions} from '@react-navigation/native';
import {string, object, number} from 'prop-types';
import {observer, inject} from 'mobx-react';
import {commonStorePropTypes} from '~/Types/propTypes';

const DEFAULT_HEADER_HEIGHT = 145;

const CommonsSwiper = ({navigation, showMax, commonStore}) => {
  const myDaos = commonStore.myCommonsValues;
  const [headerHeight, setHeaderHeight] = useState(DEFAULT_HEADER_HEIGHT);

  const headerHeightLayouted = (height) => {
    setHeaderHeight(height);
  };

  const navigateToCommon = (common) => {
    const navigate = CommonActions.navigate({
      name: 'CommonProfile',
      params: {
        currCommon: common,
      },
    });
    navigation.dispatch(navigate);
  };

  const renderCommonCard = (item, index) =>
    !showMax || index < showMax ? (
      <CommonBox
        key={item.id}
        common={item}
        navigation={navigation}
        onPress={() => navigateToCommon(item)}
        headerHeightLayouted={headerHeightLayouted}
      />
    ) : (
      <TouchableOpacity
        onPress={() => navigation.navigate('MyCommons')}
        style={{...styles.commonBox, height: headerHeight}}>
        <Text
          style={text.buttonblue}>{`View all ${myDaos.length} Commons`}</Text>
      </TouchableOpacity>
    );

  return myDaos ? (
    myDaos.length > 0 ? (
      <View style={layout.flexRow}>
        <View style={layout.flexRow}>
          <SwiperCard
            cardRenderer={(item, index) => renderCommonCard(item, index)}
            data={myDaos}
            showMax={showMax}
          />
        </View>
      </View>
    ) : (
      <View style={styles.emptyObjectContainer}>
        <Image
          style={{height: 120, width: 120}}
          source={require('../../../src/Assets/group.png')}
        />
        <Text style={{...text.h2Black, ...layout.marginTopS}}>No Commons</Text>
        <Text style={styles.textNoCommons}>
          Join your first common and start making an impact
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('Explore')}>
            <Text style={text.buttonblue}>Explore Commons</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  ) : (
    <View style={{paddingHorizontal: 20}}>
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

CommonsSwiper.propTypes = {
  navigation: object,
  userId: string,
  showMax: number,
  commonStore: commonStorePropTypes,
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

export default inject('commonStore')(observer(CommonsSwiper));

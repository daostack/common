import React, {useState} from 'react';
import {View, Dimensions, Text} from 'react-native';

import {layout} from '../Theme';

import SwiperFlatList from 'react-native-swiper-flatlist';

const {width} = Dimensions.get('window');

const SwiperCard = ({showMax, ...props}) => {
  const renderNoDataCard = props.renderNoDataCard;
  const cardRenderer = props.cardRenderer;
  const extraData = props.extraData;
  const data = props.data;

  const [swiperCurrentIndex, setSwiperCurrentIndex] = useState({
    index: 0,
    prevIndex: -1,
  });

  const renderCard = (item, index) => {
    let proposalCardStyle = {marginLeft: 20, marginRight: 20};

    if (
      index === swiperCurrentIndex.prevIndex &&
      swiperCurrentIndex.prevIndex !== swiperCurrentIndex.index
    ) {
      proposalCardStyle = {marginLeft: 50, marginRight: -10};
    }

    if (index === swiperCurrentIndex.index + 1) {
      proposalCardStyle = {marginLeft: -10, marginRight: 50};
    }

    return (
      <View style={{width: width}}>
        <View style={proposalCardStyle}>{cardRenderer(item, index)}</View>
      </View>
    );
  };

  const renderLinkCard = () =>
    <View style={{ width: width }}>
      <Text>{'OH YEAH'}</Text>
    </View>;


  const onSwiperIndexChanged = ({index, prevIndex}) => {
    setSwiperCurrentIndex({index, prevIndex});
  };

  return data.length > 0 ? (
    <View style={layout.flexRow}>
      <SwiperFlatList
        renderItem={({ item, index }) => /* index < showMax ?  */renderCard(item, index) /* : renderLinkCard() */}
        data={data}
        extraData={extraData}
        onChangeIndex={onSwiperIndexChanged}
      />
    </View>
  ) : (
    renderNoDataCard()
  );
};

export default React.memo(SwiperCard);

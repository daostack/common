import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { layout } from '../Theme';

const { width } = Dimensions.get('window');

const SwiperCard = ({ showMax, navigation, ...props }) => {
  const { renderNoDataCard } = props;
  const { cardRenderer } = props;
  const { extraData } = props;
  const { data } = props;

  const [swiperCurrentIndex, setSwiperCurrentIndex] = useState({
    index: 0,
    prevIndex: -1,
  });

  const renderCard = (item, index) => {
    let proposalCardStyle = { marginLeft: 20, marginRight: 20 };

    if (
      index === swiperCurrentIndex.prevIndex
      && swiperCurrentIndex.prevIndex !== swiperCurrentIndex.index
    ) {
      proposalCardStyle = { marginLeft: 50, marginRight: -10 };
    }

    if (index === swiperCurrentIndex.index + 1) {
      proposalCardStyle = { marginLeft: -10, marginRight: 50 };
    }

    return (
      <View style={{ width }}>
        <View style={proposalCardStyle}>{cardRenderer(item, index)}</View>
      </View>
    );
  };

  const onSwiperIndexChanged = ({ index, prevIndex }) => {
    setSwiperCurrentIndex({ index, prevIndex });
  };

  return data.length > 0 ? (
    <View style={layout.flexRow}>
      <SwiperFlatList
        renderItem={({ item, index }) => renderCard(item, index)}
        data={showMax && data.length > showMax ? data.slice(0, showMax + 1) : data}
        extraData={extraData}
        onChangeIndex={onSwiperIndexChanged}
      />
    </View>
  ) : (
    renderNoDataCard()
  );
};

export default React.memo(SwiperCard);

import React, {useState} from 'react';
import { View, Dimensions} from 'react-native';
import {layout} from '../Theme';
import SwiperFlatList from 'react-native-swiper-flatlist';

const {width} = Dimensions.get('window');

const SwiperCard = ({showMax, navigation, ...props}) => {
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

  const onSwiperIndexChanged = ({ index, prevIndex }) => {
    setSwiperCurrentIndex({ index, prevIndex });
  };

  return data.length > 0 ? (
    <View style={layout.flexRow}>
      <SwiperFlatList
        renderItem={({ item, index }) => renderCard(item, index)}
        data={data.length > showMax ? data.slice(0, showMax + 1) : data}
        extraData={extraData}
        onChangeIndex={onSwiperIndexChanged}
      />
    </View>
  ) : (
    renderNoDataCard()
  );
};

export default React.memo(SwiperCard);

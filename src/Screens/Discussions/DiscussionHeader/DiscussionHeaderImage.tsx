import React, {ReactElement} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
const {width} = Dimensions.get('window');

type Props = {
  images: {value: string}[];
  handleImageGallery: (index: number) => void;
};

export const DiscussionHeaderImage = ({
  images,
  handleImageGallery,
}: Props): ReactElement => (
  <>
    {images ? (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 20}}>
        <View style={styles.imageGallery}>
          <View style={{width: 20}} />
          {images.map(
            (currImage, currIndex: number): ReactElement => (
              <View key={`proposalImg_${currIndex}`}>
                <TouchableOpacity onPress={() => handleImageGallery(currIndex)}>
                  <Image
                    key={currIndex}
                    style={{
                      ...styles.galleryImage,
                      ...{width: width * 0.8},
                    }}
                    resizeMode="cover"
                    source={{uri: currImage.value}}
                  />
                </TouchableOpacity>
              </View>
            ),
          )}
          <View style={{width: 20}} />
        </View>
      </ScrollView>
    ) : null}
  </>
);

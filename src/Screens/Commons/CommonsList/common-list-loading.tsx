import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  Fade,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';

export const CommonListLoading = () => (
  <ScrollView
    contentContainerStyle={{
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Placeholder Animation={Fade}>
      <PlaceholderLine width={30} />
    </Placeholder>

    <Placeholder Animation={Fade}>
      {[...Array(3).keys()].map((i) => (
        <View key={`common_loading_${i}`}>
          <PlaceholderMedia
            style={{height: 200, width: '100%', marginBottom: 20}}
          />
          <PlaceholderLine width={80} />
          <PlaceholderLine />
          <PlaceholderLine width={30} />
        </View>
      ))}
    </Placeholder>
  </ScrollView>
);

import React from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {screenWidth} from '~/Util/dimensions';

export const AgendaGallery = () => {
  const imageArray = [
    'https://api.contentstack.io/v2/assets/575e4d1c0342dfd738264a1f/download?uid=bltada7771f270d08f6',
  ];
  return (
    <View>
      <Image
        source={{
          uri: imageArray[0],
        }}
        style={styles.image}
      />
      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}>
        <Image
          source={{
            uri: imageArray[0],
          }}
          style={styles.scrollImage}
        />
        <Image
          source={{
            uri: imageArray[0],
          }}
          style={styles.scrollImage}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 218,
    width: screenWidth - 48,
    alignSelf: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  scrollViewContainer: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  scrollView: {
    marginBottom: 24,
  },
  scrollImage: {
    height: 250,
    width: screenWidth * 0.55,
    alignSelf: 'center',
    borderRadius: 12,
    marginRight: 16,
  },
});

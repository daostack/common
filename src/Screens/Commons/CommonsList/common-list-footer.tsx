import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {font} from '~/Theme';

export const CommonListFooter = () => (
  <View style={styles.footerContainer}>
    <Image
      source={require('~/Assets/commonListFooter.png')}
      style={{
        resizeMode: 'contain',
        width: 84,
        height: 84,
      }}
    />
    <Text style={styles.createACommon}>Create a common</Text>
    <Text
      style={{
        fontFamily: 'NunitoSans-Regular',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
      }}>
      Anyone can create a Common, invite their friends, and work together to
      achieve common goals. Start now!
    </Text>
  </View>
);

const styles = StyleSheet.create({
  createACommon: {
    ...font.heading.bold,
    fontSize: 20,
    textAlign: 'center',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 47,
    marginTop: 60,
    marginBottom: 100,
  },
});

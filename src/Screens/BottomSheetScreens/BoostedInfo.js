import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';

import React from 'react';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const BoostedInfo = ({navigation, onContinueEditing}) => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
      vertical={true}
      nestedScrollEnabled={true}
      directionalLockEnabled={true}>
      <View style={styles.body}>
        <Image
          source={require('../../Assets/boostedImage.png')}
          style={{alignSelf: 'center'}}
        />

        <Text style={styles.title}>What`s a boosted proposal?</Text>

        <View style={styles.textWithIconContainer}>
          <Icon name="agenda" size={26} color={colors.grey6} />
          <Text style={styles.blackTextWithImage}>
            Probable alignment with Common agenda.
          </Text>
        </View>
        <View style={styles.textWithIconContainer}>
          <Icon name="group" size={26} color={colors.grey6} />
          <Text style={styles.blackTextWithImage}>
            Any majority can make a decision
          </Text>
        </View>
        <View style={styles.textWithIconContainer}>
          <Icon name="common" size={26} />
          <Text style={styles.blackTextWithImage}>Shortened voting time</Text>
        </View>

        <Text style={styles.title2}>How is this determined?</Text>
        <Text style={text.blackText}>
          An algorithm recognizes proposals which align with the Common’s agenda
          and boosts them.{' '}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingVertical: 20,
    ...text.h1Black,
    textAlign: 'left',
  },

  title2: {
    ...layout.marginTopL,
    paddingVertical: 10,
    ...text.h2Black,
    textAlign: 'left',
  },
  textWithIconContainer: {
    ...layout.content,
    ...layout.flexRow,
    paddingHorizontal: 0,
    paddingVertical: 7,
  },
  blackTextWithImage: {
    ...text.blackText,
    ...layout.marginLeftM,
  },
  scrollView: {
    flex: 1,
  },
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
  body: {
    ...layout.content,
    ...layout.flexStart,
    width: '100%',
    alignSelf: 'stretch',
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
});

export default BoostedInfo;

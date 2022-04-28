import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors, font, layout, text} from '~/Theme';
import {firebase} from '~/Firebase';
import {dateFormat} from '~/Components/Moderation/helper';

interface Props {
  cover: string;
  name: string;
  description: string;
  updatedAt: firebase.firestore.Timestamp;
}

const CommonBoxImage = ({
  cover,
  name,
  description,
  updatedAt,
}: Props): ReactElement => {
  const activeDate = dateFormat(updatedAt);
  return (
    <FastImage source={{uri: cover}} style={styles.coverBackground}>
      <View style={styles.coverOverlay}>
        <View style={styles.headerContainerWrap}>
          <View
            style={{
              ...styles.headerContainer,
              ...styles.headerContainerCenterContent,
            }}>
            <View
              style={{
                ...layout.content,
                padding: 0,
              }}>
              <Text style={styles.headerTitleWhite}>{name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerDescription} numberOfLines={2}>
            {description}
          </Text>
        </View>
        <Text style={styles.time}>Active {activeDate} ago</Text>
      </View>
    </FastImage>
  );
};

const styles = StyleSheet.create({
  time: {
    position: 'absolute',
    bottom: 8,
    ...font.primary.bold,
    fontSize: 12,
    color: colors.white,
    alignSelf: 'center',
  },
  coverBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: 134,
  },
  coverOverlay: {
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '100%',
  },
  headerContainerWrap: {
    ...layout.flexRow,
    width: '100%',
  },
  headerContainer: {
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    alignSelf: 'stretch',
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 0,
    paddingTop: 16,
  },
  headerContainerCenterContent: {
    justifyContent: 'center',
  },
  headerTitleWhite: {
    fontSize: 20,
    lineHeight: 24,
    ...font.heading.bold,
    color: colors.white,
  },
  headerDescription: {
    ...text.greyText,
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.grey4,
    textAlign: 'center',
  },
  headerContent: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 6,
  },
});

export default React.memo(CommonBoxImage);

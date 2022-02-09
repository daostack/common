import React, {ReactElement} from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {layout} from '~/Theme';
import {styles} from './styles';

interface Props {
  cover: string;
  name: string;
  description: string;
}

const CommonCardImage = ({cover, name, description}: Props): ReactElement => (
  <FastImage source={{uri: cover}} style={styles.coverBackground}>
    <View style={styles.coverOverlay}>
      <>
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
      </>
    </View>
  </FastImage>
);

export default React.memo(CommonCardImage);

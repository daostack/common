import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import Icon from '../../Assets/iconfont/Icon';
import {layout, colors, text, sizeL, sizeXXL} from '../../Theme';

const CommonCover = ({navigation, isMember, commonInfo}) => {
  return (
    <ImageBackground
      source={{
        uri: commonInfo.cover,
      }}>
      <View style={styles.headerContainerWrap}>
        <View style={styles.headerContainer}>
          {navigation ? (
            <TouchableOpacity onPress={navigation.goBack}>
              <Icon
                name="left-arrow"
                size={30}
                color={colors.white}
                style={layout.marginTopXS}
              />
            </TouchableOpacity>
          ) : null}

          <View
            style={{
              ...layout.content,

              ...{padding: 0},
            }}>
            {commonInfo.logo ? (
              <Image
                style={styles.logoImage}
                source={{
                  uri: commonInfo.logo,
                }}
              />
            ) : null}
            <Text style={styles.headerTitleWhite}>{commonInfo.name}</Text>
          </View>
          {navigation ? (
            <TouchableOpacity onPress={openCommonOptions}>
              <Icon
                name="menu-horizontal"
                size={30}
                color={colors.white}
                style={layout.marginTopXS}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.headerContent}>
        <Text style={styles.headerDescription}>{commonInfo.description}</Text>
        {isMember && navigation ? (
          <TouchableOpacity onPress={openAgendaScreen}>
            <Text style={styles.headerViewAgenda}>View agenda</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
  },
});

export default CommonCover;

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {object, bool, func, string, shape} from 'prop-types';

import Icon from '../../Assets/iconfont/Icon';
import {layout, colors, text, font} from '../../Theme';

const CommonCover = ({
  navigation,
  isMember,
  onHeaderMenuOpen,
  commonInfo: {cover, logo, name, description},
}) => {
  const renderCoverInSafeArea = () => {
    return <SafeAreaView>{renderCover()}</SafeAreaView>;
  };

  const renderCover = () => {
    return (
      <>
        <View style={styles.headerContainerWrap}>
          <View
            style={
              navigation
                ? styles.headerContainer
                : {
                  ...styles.headerContainer,
                  ...styles.headerContainerCenterContent,
                }
            }>
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
              {logo ? (
                <FastImage
                  style={styles.logoImage}
                  source={{
                    uri: logo,
                  }}
                />
              ) : null}
              <Text style={styles.headerTitleWhite}>{name}</Text>
            </View>
            {navigation ? (
              <TouchableOpacity onPress={onHeaderMenuOpen}>
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
          <Text style={styles.headerDescription} numberOfLines={2}>{description}</Text>
          {isMember && navigation ? (
            <TouchableOpacity onPress={openAgendaScreen}>
              <Text style={styles.headerViewAgenda}>View agenda</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </>
    );
  };

  const openAgendaScreen = e => {
    navigation.navigate('CommonAgenda');
  };

  return (
    <>
      <FastImage
        source={{
          uri: cover,
        }}
        imageStyle={navigation ? {} : styles.backgoundRoundedTopEdges}
        style={styles.coverBackground}>
        <View style={styles.coverOverlay}>
          {navigation ? renderCoverInSafeArea() : renderCover()}
        </View>
      </FastImage>
    </>
  );
};

CommonCover.propTypes = {
  navigation: object,
  isMember: bool,
  onHeaderMenuOpen: func,
  commonInfo: shape({
    cover: string,
    logo: string,
    name: string,
    description: string,
  }),
};

const styles = StyleSheet.create({
  coverBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  coverOverlay: {
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  backgoundRoundedTopEdges: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    paddingTop: 40,
  },
  headerContainerCenterContent: {
    justifyContent: 'center',
  },
  logoImage: {
    ...layout.marginBottomM,

    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },

  headerTitleWhite: {
    ...font.fontSize(4),
    ...font.heading.bold,
    color: colors.white,
  },
  headerDescription: {
    ...text.greyText,
    fontWeight: '600',
    color: colors.grey4,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 5,
  },
  headerViewAgenda: {
    ...text.smallGreyText,

    color: colors.grey4,
    marginTop: 30,
  },
});

export default CommonCover;

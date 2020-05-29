import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import React from 'react';

import Icon from '../../Assets/iconfont/Icon';
import {layout, colors, text} from '../../Theme';

const CommonCover = ({navigation, isMember, onHeaderMenuOpen, commonInfo}) => {
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
          <Text style={styles.headerDescription} numberOfLines={2}>{commonInfo.description}</Text>
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
      <ImageBackground
        source={{
          uri: commonInfo.cover,
        }}
        imageStyle={navigation ? {} : styles.backgoundRoundedTopEdges}
        style={styles.coverBackground}>
        <View style={styles.coverOverlay}>
          {navigation ? renderCoverInSafeArea() : renderCover()}
        </View>
      </ImageBackground>
    </>
  );
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
    ...text.h1Black,
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
    paddingHorizontal: 20,
  },
  headerViewAgenda: {
    ...text.smallGreyText,

    color: colors.grey4,
    marginTop: 30,
  },
});

export default CommonCover;

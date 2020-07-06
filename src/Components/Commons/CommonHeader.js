import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import React from 'react';
import Icon from '../../Assets/iconfont/Icon';
import { layout, colors, text } from '../../Theme';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const CommonHeader = ({ navigation, isMember, onHeaderMenuOpen, commonInfo }) => {
  const renderCoverInSafeArea = () => {
    return <SafeAreaView>{renderCover()}</SafeAreaView>;
  };

  const renderCover = () => {
    return (
      <View style={{width: width}}>
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
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {commonInfo.logo ? (
                <FastImage
                  style={styles.logoImage}
                  source={{
                    uri: commonInfo.logo,
                  }}
                />
              ) : null}
              <Text style={styles.headerTitleWhite} numberOfLines={5}>
                {commonInfo.name}
              </Text>
              <Text style={{...text.textFieldfocus, color: colors.white}} numberOfLines={5}>
                {commonInfo.byline}
              </Text>
            </View>
            {navigation ? (
              <TouchableOpacity /* onPress={onHeaderMenuOpen} */>
                {/* <Icon
                  name="menu-horizontal"
                  size={30}
                  color={colors.white}
                  style={layout.marginTopXS}
                /> */}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerDescription} numberOfLines={4}>
            {commonInfo.description}
          </Text>
          {isMember && navigation ? (
            <TouchableOpacity onPress={openAgendaScreen}>
              <Text style={styles.headerViewAgenda}>View agenda</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const openAgendaScreen = e => {
    navigation.navigate('CommonAgenda');
  };

  return (
    <>
      <View style={styles.coverOverlay}>
        {navigation ? renderCoverInSafeArea() : renderCover()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  coverBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  coverOverlay: {
    paddingVertical: 0,
    paddingBottom: 20,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  backgoundRoundedTopEdges: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  headerContainerWrap: {
    ...layout.flexRow,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    // width: '30%',
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
  },
});

export default CommonHeader;

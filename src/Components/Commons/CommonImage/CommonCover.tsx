import {bool, func, InferProps, shape, string} from 'prop-types';
import React, {useCallback} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from '~/Assets/iconfont/Icon';
import {colors, layout} from '~/Theme';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {styles} from './styles';

const props = {
  navigation: shape({
    navigate: func.isRequired,
    goBack: func.isRequired,
  }),
  isMember: bool,
  onHeaderMenuOpen: func,
  commonInfo: shape({
    cover: string.isRequired,
    name: string.isRequired,
    description: string.isRequired,
  }).isRequired,
  common: shape({
    id: string.isRequired,
  }).isRequired,
};

const CommonCover: React.FC<InferProps<typeof props>> = ({
  navigation,
  isMember,
  onHeaderMenuOpen,
  commonInfo: {cover, name, description},
  common,
}) => {
  const handleHeaderMenuOpen = useCallback(() => {
    if (!onHeaderMenuOpen) {
      return;
    }

    onHeaderMenuOpen();
  }, [onHeaderMenuOpen]);

  const renderCoverInSafeArea = () => (
    <SafeAreaView>{renderCover()}</SafeAreaView>
  );
  const renderCover = () => (
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
          {navigation && (
            <TouchableOpacity onPress={navigation.goBack}>
              <Icon
                name="left-arrow"
                size={30}
                color={colors.white}
                style={layout.marginTopXS}
              />
            </TouchableOpacity>
          )}

          <View
            style={{
              ...layout.content,
              ...{padding: 0},
            }}>
            <Text style={styles.headerTitleWhite}>{name}</Text>
          </View>
          {navigation && (
            <TouchableOpacity onPress={handleHeaderMenuOpen}>
              <Icon
                name="menu-horizontal"
                size={30}
                color={colors.white}
                style={layout.marginTopXS}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.headerContent}>
        <Text style={styles.headerDescription} numberOfLines={2}>
          {description}
        </Text>
        {isMember && navigation && (
          <TouchableOpacity onPress={openAgendaScreen}>
            <Text style={styles.headerViewAgenda}>View agenda</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
  const openAgendaScreen = () => {
    if (navigation) {
      navigation.navigate(NAVIGATION_SCREENS.COMMON_AGENDA, {
        commonId: common.id,
      });
    }
  };
  return (
    <>
      <FastImage source={{uri: cover}} style={styles.coverBackground}>
        <View style={styles.coverOverlay}>
          {navigation ? renderCoverInSafeArea() : renderCover()}
        </View>
      </FastImage>
    </>
  );
};

CommonCover.propTypes = props;

export default CommonCover;

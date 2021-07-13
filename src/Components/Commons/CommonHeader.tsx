import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StyleProp,
} from 'react-native';
import React from 'react';
import {layout, colors, text, font} from '~/Theme';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import Icon from '~/Assets/iconfont/Icon';
import {BlurView} from '~/Components';
import {object, shape, string, bool, func, InferProps} from 'prop-types';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

const props = {
  navigation: object,
  isMember: bool,
  headerHeightLayouted: func,
  commonInfo: shape({
    logo: string,
    name: string.isRequired,
    description: string,
    byline: string,
  }).isRequired,
  common: shape({
    id: string.isRequired,
  }).isRequired,
  canEdit: bool,
  onEdit: func,
};

const CommonHeader: React.FC<InferProps<typeof props>> = ({
  navigation,
  isMember,
  commonInfo: {logo, name, description, byline},
  headerHeightLayouted,
  common,
  canEdit,
  onEdit,
}) => {
  const openAgendaScreen = () => {
    navigation.navigate(NAVIGATION_SCREENS.COMMON_AGENDA, {
      commonId: common.id,
      canEdit,
      onEdit,
      common,
    });
  };
  return (
    <SafeAreaView
      onLayout={(event) => {
        headerHeightLayouted(event.nativeEvent.layout.height);
      }}
      style={styles.headerContainer}>
      {logo && (
        <FastImage
          style={styles.logoImage as StyleProp<ImageStyle>}
          source={{uri: logo}}
        />
      )}
      <Text style={styles.headerTitleWhite} numberOfLines={5}>
        {name}
      </Text>
      <Text
        style={{
          ...text.textFieldfocus,
          color: colors.white,
          textAlign: 'center',
        }}
        numberOfLines={5}>
        {byline}
      </Text>
      <Text style={styles.headerDescription} numberOfLines={4}>
        {description}
      </Text>
      {isMember && navigation && (
        <BlurView
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
          }}>
          <TouchableOpacity onPress={openAgendaScreen}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.headerViewAgenda}>View agenda</Text>
              <Icon name="right-arrow" color="white" />
            </View>
          </TouchableOpacity>
        </BlurView>
      )}
    </SafeAreaView>
  );
};

CommonHeader.propTypes = props;

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
    alignSelf: 'stretch',
    flexGrow: 1,
    padding: 0,
    marginBottom: 10,
    ...layout.flexEnd,
  },
  headerContainerCenterContent: {
    justifyContent: 'center',
  },
  logoImage: {
    ...layout.marginBottomM,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
  },
  headerTitleWhite: {
    ...font.fontSize(4),
    ...font.heading.bold,
    color: colors.white,
    textAlign: 'center',
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
    fontSize: 14,
    marginRight: 5,
  },
});

export default CommonHeader;

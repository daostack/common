import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import { layout, colors, text, font } from '../../Theme';
import FastImage from 'react-native-fast-image';
import Icon from '../../Assets/iconfont/Icon';
import { BlurView } from '../../Components';
import {CommonActions} from '@react-navigation/native';

const CommonHeader = ({ navigation, isMember, onHeaderMenuOpen, commonInfo, headerHeightLayouted }) => {

  const openAgendaScreen = e => {
    navigation.navigate('CommonAgenda', {
      screenTitle: commonInfo.name,
    });
  };

  return (
    <SafeAreaView onLayout={ event => {
      headerHeightLayouted(event.nativeEvent.layout.height);
    }}
    style={styles.headerContainer}
    >
        
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
          <Text style={styles.headerDescription} numberOfLines={4}>
            {commonInfo.description}
          </Text>
          {isMember && navigation ? (
            <BlurView style={{ paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10}}>
              <TouchableOpacity onPress={openAgendaScreen}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.headerViewAgenda}>View agenda</Text>
                  <Icon name="right-arrow" color="white" />
                </View>
              </TouchableOpacity>
            </BlurView>
          ) : null}

        
      
    </SafeAreaView>
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
    fontSize: 14,
    marginRight: 5,
  },
});

export default CommonHeader;

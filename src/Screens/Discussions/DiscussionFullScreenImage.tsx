import React, {FC} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, font, sizeM} from '~/Theme';
import FastImage from 'react-native-fast-image';
import Icon from '~/Assets/iconfont/Icon';
import NavigationBar from 'react-native-navbar';
import moment from 'moment';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import RootStore from '~/Stores/RootStore';
import Iconmenu1 from '~/Assets/iconfont/Iconmenu1';

type Props = {
  navigation: {
    goBack: () => void;
  };
  route: {
    params: {
      userId: string;
      userAvatar: string;
      userName: string;
      imageUrl: string;
      createTime: FirebaseFirestoreTypes.Timestamp;
      isModerator: boolean;
      openMessageOptions: () => void;
    };
  };
  rootStore: RootStore;
};

const DiscussionFullScreenImage: FC<Props> = ({
  navigation,
  route: {
    params: {imageUrl, userName, userAvatar, createTime, openMessageOptions},
  },
}) => (
  <SafeAreaView style={styles.container}>
    <NavigationBar
      statusBar={{hidden: true}}
      // @ts-ignore
      containerStyle={styles.navbarSection}
      leftButton={
        <View style={styles.leftButtonContainer}>
          {userAvatar ? (
            <FastImage style={styles.imageAvatar} source={{uri: userAvatar}} />
          ) : (
            <View style={styles.displayNameContainer}>
              <Text style={styles.displayName}>
                {userName && userName.substring(0, 1)}
              </Text>
            </View>
          )}
          <View style={styles.primaryNameContainer}>
            <Text style={styles.primaryName}>{userName}</Text>
            <Text style={styles.date}>
              {moment(createTime.toDate()).fromNow()}
            </Text>
          </View>
        </View>
      }
      rightButton={
        <View style={styles.rightButtonContainer}>
          <TouchableOpacity onPress={openMessageOptions}>
            <Iconmenu1 size={20} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={20} color={'white'} />
          </TouchableOpacity>
        </View>
      }
    />
    <FastImage
      source={{uri: imageUrl}}
      style={styles.image}
      resizeMode={'contain'}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0, 15, 30)',
  },
  navbarSection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  footer: {
    height: 70,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  continueButton: {
    width: '100%',
    height: 48,
    borderRadius: 32,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
  image: {flex: 1},
  continueButtonText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: 'white',
  },
  imageAvatar: {
    backgroundColor: colors.grey3,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  displayNameContainer: {
    backgroundColor: colors.grey3,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayName: {
    ...font.primary.bold,
    ...font.fontSize(3),
    color: colors.white,
  },
  primaryNameContainer: {
    flex: 1,
    marginLeft: sizeM,
  },
  primaryName: {
    ...font.primary.bold,
    ...font.fontSize(2),
    color: colors.white,
  },
  date: {
    color: colors.white,
    ...font.primary.regular,
    ...font.fontSize(1),
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DiscussionFullScreenImage;

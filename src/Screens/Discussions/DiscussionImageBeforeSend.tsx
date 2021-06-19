import React, {FC, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import StorageService from '~/Services/StorageService';
import {colors, font} from '~/Theme';
import Toast from '~/Util/Toast';
import FastImage from 'react-native-fast-image';
import {DiscussionMessageImage} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {sendDiscussionImageMessage} from '~/Services/ListServices/DiscussionMessageListService';
import Icon from '~/Assets/iconfont/Icon';
import NavigationBar from 'react-native-navbar';

type Props = {
  navigation: {
    goBack: () => void;
  };
  route: {
    params: {
      image: DiscussionMessageImage;
      ownerId: string;
      commonId: string;
      discussionId: string;
    };
  };
};

const DiscussionImageBeforeSend: FC<Props> = ({
  navigation,
  route: {
    params: {image, ownerId, commonId, discussionId},
  },
}) => {
  const [isUploading, setUploading] = useState(false);

  const sendMessageToDiscussion = async (url: string) => {
    try {
      await sendDiscussionImageMessage(discussionId, ownerId, {
        image: {
          ...image,
          url,
        },
        createTime: new Date(),
        ownerId,
        commonId,
        discussionId,
      });
    } catch (e) {
      Toast.error(e);
    }
  };

  const handleSendImage = async () => {
    Toast.loading('Uploading...');
    setUploading(true);
    try {
      const url = await StorageService.getInstance().uploadImage(image.url);
      Toast.hide();
      await sendMessageToDiscussion(url);

      Toast.success('Done');
      navigation.goBack();
    } catch (e) {
      Toast.error(e);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        statusBar={{hidden: true}}
        // @ts-ignore
        containerStyle={styles.navbarSection}
        leftButton={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left-arrow" size={32} color={'white'} />
          </TouchableOpacity>
        }
        rightButton={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={20} color={'white'} />
          </TouchableOpacity>
        }
      />
      <FastImage
        source={{uri: image.url}}
        style={styles.image}
        resizeMode={'contain'}
      />
      <View style={styles.footer}>
        {!isUploading && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleSendImage}>
            <Text style={styles.continueButtonText}>Send</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0, 15, 30)',
  },
  navbarSection: {
    width: '100%',
    paddingHorizontal: 20,
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
});

export default DiscussionImageBeforeSend;

import React, {ReactElement, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {BlurView} from '~/Components';
import {colors, font} from '~/Theme';
import ImagePicker from 'react-native-image-picker';
import StorageService from '~/Services/StorageService';
import Toast from '~/Util/Toast';
import {handlePermission} from '~/Util/Permissions';
import logger from '~/Services/Logger';

type Props = {
  width: number;
  commonName: string;
  commonByLine: string;
  currImage: string;
  onImageChanged: (value: string) => void;
};

const CommonImage = ({
  width,
  commonName,
  commonByLine,
  currImage,
  onImageChanged,
}: Props): ReactElement => {
  const [templateIndex, setTemplateIndex] = useState(1);

  const getImageUrl = (index: number) =>
    `https://firebasestorage.googleapis.com/v0/b/common-daostack.appspot.com/o/public_img%2Fcover_template_0${index}.png?alt=media`;

  const pickImage = async () => {
    const options = {
      title: 'Select profile image',
      quality: 0.7,
      allowsEditing: false,
    };
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        logger.log('User cancelled image picker');
      } else if (response.error) {
        // only for ios because android handles this
        Platform.OS === 'ios' && (await handlePermission());
        Toast.error(response.error);
        logger.log('ImagePicker Error: ', response.error);
      } else {
        Toast.loading('Uploading...');
        StorageService.uploadImage(response.uri)
          .then((url: string) => {
            Toast.hide();
            Toast.success('Done');
            //reviewFormStore.fieldChanged(CreateCommonForm.IMAGE, url);
            onImageChanged && onImageChanged(url);
          })
          .catch((error: Error) => Toast.error(error));
      }
    });
  };

  const changeIndex = (currrNumber: number) => {
    let index = templateIndex + currrNumber;
    if (index <= 1) {
      index = 1;
    }

    if (index >= 8) {
      index = 8;
    }
    setTemplateIndex(index);
    const currImageUrl = getImageUrl(index);
    onImageChanged && onImageChanged(currImageUrl);
  };

  const currCommonImage =
    currImage || getImageUrl(1 + Math.floor(Math.random() * Math.floor(7)));

  return (
    <View
      style={{
        height: 225,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={[styles.imageStyle, {width: width}]}
        source={{
          uri: currCommonImage,
        }}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.pickImageButton}
        onPress={() => pickImage()}>
        <Text style={styles.pickImageText}>Select or upload cover image</Text>
        <BlurView style={styles.pickImageIcon}>
          <Icon name={'addpicture'} color="white" size={20} />
        </BlurView>
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            padding: 10,
            opacity: templateIndex === 1 ? 0.5 : 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}
          onPress={() => changeIndex(-1)}>
          <Icon name="left-arrow" color="white" size={35} />
        </TouchableOpacity>
        <View style={[styles.namesContainer, {width: width - 100}]}>
          <Text style={styles.titleName}>{commonName}</Text>
          {!!commonByLine && <Text style={styles.byline}>{commonByLine}</Text>}
        </View>
        <TouchableOpacity
          style={{
            padding: 10,
            opacity: templateIndex === 8 ? 0.5 : 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}
          onPress={() => changeIndex(1)}>
          <Icon name="right-arrow" color="white" size={35} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    position: 'absolute',
    height: 225,
    backgroundColor: colors.grey4,
  },

  titleName: {
    color: colors.white,
    textAlign: 'center',
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    ...font.primary.bold,
    ...font.fontSize(4),
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
    elevation: 2,
  },
  byline: {
    width: '100%',
    color: colors.white,
    textAlign: 'center',
    alignSelf: 'center',
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  pickImageButton: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    padding: 10,
    color: colors.white,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  pickImageText: {
    color: colors.white,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  pickImageIcon: {
    position: 'absolute',
    right: 15,
    padding: 12,
    borderRadius: 14,
  },
  namesContainer: {
    justifyContent: 'center',
  },
});

export default CommonImage;

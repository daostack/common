import * as React from 'react';
import {Image, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Icon} from '~/Assets/iconfont/Icon';
import colors from '~/Theme/colors';
import layout from '~/Theme/layout';
import text from '~/Theme/text';
import {observer} from 'mobx-react';
import {UserModel} from '~/Stores/Models';
import {ImagePickerUploader} from '~/Stores';

const PickUserImage: React.FC<{user: UserModel}> = observer(({user}) => {
  const [imagePickerUploader] = React.useState(new ImagePickerUploader());
  React.useEffect(() => {
    if (imagePickerUploader.imageUrl) {
      user.update({photoUrl: imagePickerUploader.imageUrl});
    }
  }, [imagePickerUploader.imageUrl]);
  return (
    <View style={styles.imageFieldPlaceholderView}>
      <View
        style={{
          borderColor: colors.grey3,
          borderWidth: 2,
          borderRadius: 5,
          padding: 15,
        }}>
        <Icon name="addpicture" size={18} />
      </View>
      <Text
        style={{
          ...text.h2Black,
          ...layout.marginTopM,
          fontSize: 16,
        }}>
        Upload images from your phone
      </Text>
      <Text
        style={{
          ...text.h2Black,
          ...layout.marginTopS,
          ...{fontWeight: 'normal'},
          fontSize: 16,
        }}>
        Get more attention to your proposal
      </Text>
      <View style={layout.flexRow}>
        <TouchableOpacity
          style={styles.btn}
          onPress={imagePickerUploader.pickImage}>
          <Text style={[text.buttonblue, {fontSize: 16}]}>Add Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

interface UserImageViewProps {
  isAvatar: boolean;
  user?: UserModel;
  editable: boolean;
}

const InnerImage: React.FC<UserImageViewProps> = ({
  isAvatar,
  user,
  editable,
}) => {
  const imageStyle = isAvatar
    ? styles.userImageAvatarStyle
    : styles.userImageStyle;
  if (user) {
    return editable ? (
      <PickUserImage user={user} />
    ) : (
      <Image
        style={imageStyle}
        resizeMode="cover"
        source={{
          uri: user.photoURL,
        }}
      />
    );
  } else if (isAvatar) {
    return (
      <View style={imageStyle}>
        <Icon name="account-place-holder1" size={100} />
      </View>
    );
  }
  return null;
};

const ImageContainer: React.FC<{isAvatar: boolean}> = ({
  children,
  isAvatar,
}) => (
  <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <View
      style={
        isAvatar ? styles.userImageAvatarContainer : styles.userImageContainer
      }>
      <View>{children}</View>
    </View>
  </View>
);

export const UserImage: React.FC<UserImageViewProps> = (props) => (
  <ImageContainer isAvatar={props.isAvatar}>
    <InnerImage {...props} />
  </ImageContainer>
);

const styles = StyleSheet.create({
  btn: {
    ...layout.marginTopM,
    ...layout.btnOutline,
    flexDirection: 'row',
    marginTop: 40,
    borderRadius: 10,
    backgroundColor: colors.white,
    flexGrow: 0,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  textfield: {
    //minHeight: 48,
    alignSelf: 'stretch',
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,
    paddingHorizontal: 12,
    ...layout.marginTopS,
  },
  userImageAvatarContainer: {
    width: 100,
  },

  userImageContainer: {
    width: '100%',
  },

  userImageAvatarStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: 'rgba(0, 26, 54, 0.1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    alignSelf: 'center',
  },
  userImageStyle: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    backgroundColor: colors.paleGrey,
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  imageFieldPlaceholderView: {
    ...layout.content,
    backgroundColor: colors.paleGrey,
    borderRadius: 20,
    marginBottom: 20,
  },
});

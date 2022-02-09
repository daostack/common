import {Linking, Alert, PermissionsAndroid} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import Toast from '~/Util/Toast';

export const handlePermission = async () =>
  request(PERMISSIONS.IOS.CAMERA).then((resp) => {
    // perhaps make this a bottom message(like the login from CommonList screen)?
    Alert.alert(
      'Permission required',
      'To access camera you need to allow pemissions in settings',
      [
        {
          text: 'Settings',
          onPress: () => Linking.openSettings(),
        },
        {
          text: 'Cancel',
        },
      ],
      {cancelable: false},
    );
  });

export const requestAndroidCameraPermission = async (takePhoto) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'App Camera Permission',
        message: 'App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      takePhoto();
    } else {
      Toast.error('Camera permission denied');
    }
  } catch (err) {
    Toast.error(err);
  }
};

import {Linking, Alert} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';

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

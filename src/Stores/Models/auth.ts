import auth from '@react-native-firebase/auth';

export const getCurrentUser = () => auth().currentUser;

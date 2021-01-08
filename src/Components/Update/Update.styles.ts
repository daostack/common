import {Dimensions, StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    minHeight: height,
    alignItems: 'center',
  },

  logo: {
    marginVertical: 30,
    resizeMode: 'contain',
  },

  image: {
    top: 0,
    height: '40%',
    alignSelf: 'center',
    aspectRatio: 1,
    marginBottom: 'auto',
  },

  header: {
    ...font.fontSize(6),
    ...font.heading.bold,
    marginBottom: 20,
  },

  description: {
    ...font.fontSize(2),
    ...font.primary.semiBold,
    width: width * 0.8,
    textAlign: 'center',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100000,
    backgroundColor: colors.mainBlue,
    width: width * 0.9,
    marginTop: 'auto',
    marginBottom: 20,
  },

  buttonText: {
    color: colors.white,
    ...font.fontSize(4),
    ...font.primary.regular,
    paddingVertical: 10,
  },
});

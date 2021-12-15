import {StyleSheet} from 'react-native';
import {colors} from '~/Theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    marginTop: 24,
    marginBottom: 22,
    height: 315,
    backgroundColor: colors.iceBlue2,
  },
  containerError: {
    height: 152,
    backgroundColor: 'rgba(255,174,38, 0.1)',
  },
  fundingImage: {
    aspectRatio: 1,
    height: 137,
    width: 137,
    marginRight: 14,
    marginBottom: 13,
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 5,
    marginHorizontal: 0,
  },
  titleErrorContainer: {
    marginTop: 24,
    marginHorizontal: 19,
    flexDirection: 'row',
    height: 48,
  },
  title: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    lineHeight: 20,
  },
  titleError: {
    marginLeft: 24,
    textAlign: 'left',
  },
  button: {
    height: 48,
    backgroundColor: colors.white,
    marginHorizontal: 28,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grey4,
  },
  buttonTitle: {
    marginLeft: 24,
    textAlign: 'center',
    fontSize: 16,
  },
});

import {Platform, StyleSheet, Dimensions} from 'react-native';
import {colors, sizeS, sizeXL, text} from '~/Theme';

const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingBottom: 30,
    backgroundColor: colors.paleLilacTwo,
  },
  inputContainer: {
    position: 'absolute',
    top: 0,
  },
  inputWrapper: {
    width,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: colors.paleLilacTwo,
    borderTopColor: colors.grey4,
    borderTopWidth: 1,
    width: '75%',
    flexDirection: 'row',
    borderRadius: 40,
    textAlignVertical: 'center',
    paddingTop: Platform.OS === 'ios' ? 15 : 10,
    paddingBottom: Platform.OS === 'ios' ? 15 : 10,
    paddingHorizontal: 15,
  },
  joinCommonText: {
    ...text.textFieldplaceholder,
    width,
    textAlign: 'center',
    color: colors.greySubtitle,
    paddingTop: sizeS,
    paddingBottom: sizeXL,
    alignSelf: 'center',
  },
  nonMemberContainer: {
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
  },
});

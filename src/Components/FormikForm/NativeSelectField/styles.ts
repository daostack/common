import {StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';

export const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: 'stretch',
  },
  label: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.slate,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  modalViewTop: {
    flex: 1,
  },
  modalViewBottom: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 215,
  },
  modalViewMiddle: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#dedede',
    zIndex: 2,
  },
  chevronContainer: {
    flexDirection: 'row',
  },
  chevron: {
    width: 15,
    height: 15,
    backgroundColor: 'transparent',
    borderColor: '#a1a1a1',
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  chevronUp: {
    marginLeft: 11,
    transform: [{translateY: 0}, {rotate: '-135deg'}],
  },
  chevronDown: {
    marginLeft: 22,
    transform: [{translateY: 0}, {rotate: '45deg'}],
  },
  chevronActive: {
    borderColor: '#007aff',
  },
  done: {
    color: '#007aff',
    fontWeight: '600',
    fontSize: 17,
    paddingTop: 1,
    paddingRight: 11,
  },
  headlessAndroidPicker: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: 'transparent',
    backgroundColor: 'transparent',
    opacity: 0,
  },
  pickerValueContainer: {
    height: 48,
    width: '100%',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pickerValue: {
    color: '#001a36',
  },
});

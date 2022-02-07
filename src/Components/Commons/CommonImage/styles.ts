import {StyleSheet} from 'react-native';
import {colors, font, layout, text} from '~/Theme';

export const styles = StyleSheet.create({
  coverBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  coverOverlay: {
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  headerContainerWrap: {
    ...layout.flexRow,
    width: '100%',
  },
  headerContainer: {
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    alignSelf: 'stretch',
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 0,
    paddingTop: 35,
  },
  headerContainerCenterContent: {
    justifyContent: 'center',
  },
  headerTitleWhite: {
    ...font.fontSize(4),
    ...font.heading.bold,
    color: colors.white,
  },
  headerDescription: {
    ...text.greyText,
    fontWeight: '600',
    color: colors.grey4,
    textAlign: 'center',
  },
  headerContent: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 5,
  },
  headerViewAgenda: {
    ...text.smallGreyText,
    color: colors.grey4,
    marginTop: 30,
  },
});

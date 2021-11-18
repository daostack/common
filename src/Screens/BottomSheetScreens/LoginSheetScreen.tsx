import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import {colors, text, layout} from '~/Theme';
import {observer} from 'mobx-react';
import {CreateAccountScreen} from '~/Screens';
import {useStore} from '~/Stores';

export const LoginSheetScreen: React.FC<{message?: string}> = observer(
  ({message}) => {
    const {
      authStore,
      uiStore: {bottomSheetStore},
    } = useStore();
    React.useEffect(() => {
      if (authStore.signedInUser) {
        bottomSheetStore.hideBottomSheet();
      }
    }, [authStore.signedInUser]);

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.sheetTitleStyle}>Be a part of Common</Text>
        <Text
          style={{
            ...styles.sheetTextStyle,
            ...layout.marginBottomXL,
          }}>
          {message || 'Connect your account to join this Common'}
        </Text>

        <View style={layout.flexRow}>
          <CreateAccountScreen hidePlaceholder />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  sheetTitleStyle: {
    ...text.centered,
    ...text.h2Black,
    ...layout.marginTopM,
  },

  googleSignInButton: {
    alignSelf: 'stretch',
    height: 56,
    borderWidth: 1,
    borderRadius: 28,
    borderStyle: 'solid',
    borderColor: colors.grey4,

    shadowOpacity: 0,
    shadowColor: colors.white,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 0,
    elevation: 3,
  },

  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
});

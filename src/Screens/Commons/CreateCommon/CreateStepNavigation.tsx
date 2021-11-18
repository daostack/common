import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens';
import {useNavigation, StackActions} from '@react-navigation/core';
import {useStore} from '~/Stores';

export const CreateStepNavigation = ({title}: {title: string}) => {
  const navigation = useNavigation();
  const {
    uiStore: {bottomSheetStore},
  } = useStore();
  return (
    <NavigationBar
      statusBar={{hidden: true}}
      title={{
        title: title,
      }}
      leftButton={
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.dispatch(StackActions.pop())}>
          <Icon name="left-arrow" size={28} style={styles.icon} color="black" />
        </TouchableOpacity>
      }
      rightButton={
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => {
            bottomSheetStore.showBottomSheet(BOTTOM_SHEET.UNSAVED_CHANGES, {
              navigation: navigation,
              onContinueEditing: () => bottomSheetStore.hideBottomSheet(),
              onLeaveWithoutSaving: () => {
                bottomSheetStore.hideBottomSheet();
                navigation.dispatch(StackActions.popToTop());
              },
            });
          }}>
          <Icon
            name="close"
            size={18}
            style={{marginRight: 20}}
            color="black"
          />
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
  },
  icon: {marginLeft: 20},
});

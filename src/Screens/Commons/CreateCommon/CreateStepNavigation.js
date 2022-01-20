import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import {observer, inject} from 'mobx-react';
import {string, object} from 'prop-types';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import {uiStorePropTypes} from '~/Types/propTypes';

const CreateStepNavigation = ({title, uiStore, navigation}) => (
  <NavigationBar
    statusBar={{hidden: true}}
    title={{
      title: title,
    }}
    leftButton={
      <TouchableOpacity style={styles.button} onPress={() => navigation.pop()}>
        <Icon name="left-arrow" size={28} style={styles.icon} color="black" />
      </TouchableOpacity>
    }
    rightButton={
      <TouchableOpacity
        style={{justifyContent: 'center'}}
        onPress={() => {
          uiStore.bottomSheetStore.showBottomSheet(
            BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES,
            {
              navigation: navigation,
              onContinueEditing: () =>
                uiStore.bottomSheetStore.hideBottomSheet(),
              onLeaveWithoutSaving: () => {
                uiStore.bottomSheetStore.hideBottomSheet();
                navigation.popToTop();
              },
            },
          );
        }}>
        <Icon name="close" size={18} style={{marginRight: 20}} color="black" />
      </TouchableOpacity>
    }
  />
);

CreateStepNavigation.propTypes = {
  title: string,
  navigation: object,
  uiStore: uiStorePropTypes,
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
  },
  icon: {marginLeft: 20},
});

export default inject('uiStore')(observer(CreateStepNavigation));

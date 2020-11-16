import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import {observer, inject} from 'mobx-react';
import {string, object, shape, func } from 'prop-types';
import {BOTTOM_SHEET_TEMPLATES} from '~/Stores/BottomSheetStore';

const CreateStepNavigation = ({title, 
  bottomSheetStore, navigation}) => (
  <NavigationBar
    statusBar={{hidden: true}}
    title={{
      title: title,
    }}
    leftButton={
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.pop()}>
        <Icon name="left-arrow" size={28} style={styles.icon} color="black" />
      </TouchableOpacity>
    }
    rightButton={
      <TouchableOpacity
        style={{justifyContent: 'center'}}
          onPress={() => {
            bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.UNSAVED_CHANGES, {
              navigation: navigation,
              onContinueEditing: () => bottomSheetStore.hideBottomSheet(),
              onLeaveWithoutSaving: () => {
                bottomSheetStore.hideBottomSheet()
                navigation.popToTop()
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

CreateStepNavigation.propTypes = {
  title: string,
  navigation: object,
  bottomSheetStore: shape({
    showBottomSheet: func,
    hideBottomSheet: func,
  }),
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
  },
  icon: {marginLeft: 20},
});

export default inject(
  'bottomSheetStore',
)(observer(CreateStepNavigation));

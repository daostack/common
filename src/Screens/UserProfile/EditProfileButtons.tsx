import {useFormikContext} from 'formik';
import {isEqual} from 'lodash';
import {observer} from 'mobx-react-lite';
import React, {ReactElement, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors, layout, text} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';

interface Props {
  isCompleteAccount: boolean;
  onFormClose: () => void;
}

export const EditProfileButtons = observer(
  ({isCompleteAccount, onFormClose}: Props): ReactElement => {
    const {
      authStore: {userInfo},
    } = useStore('rootStore');
    const {values, handleSubmit} = useFormikContext();

    const saveBtnStyle = useMemo(
      () => (isCompleteAccount ? styles.bigSaveBtn : layout.marginLeftS),
      [isCompleteAccount],
    );

    const hasFormChanges = useMemo(
      () =>
        isEqual(values, {
          photoURL: userInfo!.photoURL,
          firstName: userInfo!.firstName,
          lastName: userInfo!.lastName,
          country: userInfo!.country,
          email: userInfo!.email,
          intro: userInfo!.intro,
          phoneNumber: userInfo!.phoneNumber,
        }),
      [values, userInfo],
    );

    return (
      <View
        style={
          isCompleteAccount ? styles.oneBtnContainer : styles.multiBtnContainer
        }>
        {!isCompleteAccount && (
          <TouchableOpacity
            style={{
              ...styles.btns,
              ...layout.btnOutline,
              ...layout.marginRightS,
            }}
            onPress={onFormClose}>
            <Text style={text.buttonblue}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            ...styles.btns,
            ...layout.btnPrimary,
            ...saveBtnStyle,
            backgroundColor: hasFormChanges ? colors.paleblue : colors.mainBlue,
          }}
          disabled={hasFormChanges}
          onPress={handleSubmit}>
          <Text style={text.buttoncenterwhite}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  btns: {
    alignSelf: 'stretch',
  },
  bigSaveBtn: {
    width: '100%',
  },
  oneBtnContainer: {
    padding: 20,
    backgroundColor: colors.white,
  },
  multiBtnContainer: {
    ...layout.content,
    ...layout.flexRow,
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.white,
  },
});

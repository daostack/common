import React, {ReactElement} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, layout} from '~/Theme';

interface Props {
  onCancel: () => void;
  onDelete: () => void;
}

export const ModalDeleteConfirmation = ({onCancel, onDelete}: Props): ReactElement => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.body, {marginBottom: insets.bottom + 16}]}>
      <View style={styles.plug} />
      <Image
        source={require('~/Assets/illustrationsMediumEdit.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Are you sure?</Text>
      <Text style={styles.text}>If you delete this Common the data will be erased. You can not restore your Common once you delete it.</Text>
        <>
          <TouchableOpacity
            style={[styles.btn, styles.deleteBtn]}
            onPress={onDelete}>
            <Text style={styles.btnDeleteText}>Delete commmon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={onCancel}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </>
    </View>
  );
};

  const styles = StyleSheet.create({
    body: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 7,
    },
    plug: {
      backgroundColor: colors.paleblue,
      width: 72,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 24,
    },
    image: {
      height: 116,
      aspectRatio: 1,
    },
    title: {
      ...font.primary.bold,
      fontSize: 20,
      lineHeight: 28,
      alignSelf: 'center',
      marginTop: 16,
      marginBottom: 8,
    },
    text: {
      ...font.primary.regular,
      fontSize: 16,
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: 24,
    },
    btn: {
      alignSelf: 'stretch',
      ...layout.content,
      ...layout.flexRow,
      ...layout.flexStart,
      paddingVertical: 14,
      borderWidth: 1,
      borderRadius: 32,
      borderColor: colors.grey4,
      justifyContent: 'center',
    },
    deleteBtn: {
      marginBottom: 16,
    },
    btnText: {
      textAlign: 'center',
      ...font.primary.regular,
      fontSize: 16,
      lineHeight: 20,
      color: colors.black,
    },
    btnDeleteText: {
      textAlign: 'center',
      ...font.primary.regular,
      fontSize: 16,
      lineHeight: 20,
      color: colors.pinkishOrange,
    },
  });


import React, {useCallback, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {ModalAddBankAccount} from '~/Screens/ReceiveFunds/components/ModalAddBankAccount';
import {colors, font, layout, text} from '~/Theme';

export const ReceiveFunds = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const addBankAccount = useCallback(() => {
    setIsModalVisible(true);
  }, []);
  const closeModal = () => {
    setIsModalVisible(false);
  };
  const removeAccount = () => {
    console.log('remove');
  };

  return (
    <View style={styles.container}>
      <View style={styles.emptyObjectContainer}>
        <Image
          style={styles.image}
          source={require('~/Assets/funds.png')}
        />
        <Text style={styles.subTitle}>
          You must provide bank account details in order to receive funds
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={addBankAccount}>
          <Text style={styles.buttonText}>
            Add Bank Account
          </Text>
        </TouchableOpacity>
      </View>
      <BottomSheetModal
        style={{borderRadius: 30}}
        isVisible={isModalVisible}
        onClose={closeModal}>
          <ModalAddBankAccount
            onCancel={closeModal}
            onDelete={removeAccount}
          />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  emptyObjectContainer: {
    width: '100%',
    ...layout.content,
    paddingHorizontal: 28,
    paddingBottom: 24,
    paddingTop: 32,
    borderRadius: 14,
    backgroundColor: colors.iceBlue,
    alignSelf: 'center',
    marginHorizontal: 12,
  },
  subTitle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    ...text.centered,
    marginVertical: 16,
  },
  btn: {
    backgroundColor: colors.mainBlue,
    height: 56,

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    paddingHorizontal: 50,
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    ...text.buttonblack,
    color: colors.white,
  },
  image: {
    height: 160,
    width: 160,
  },
});


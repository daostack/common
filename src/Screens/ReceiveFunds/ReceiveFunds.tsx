import React, {useCallback, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {AddBankAccountForm} from '~/Components/Forms/AddBankAccountForm';
import {ModalAddBankAccount} from '~/Screens/ReceiveFunds/components/ModalAddBankAccount';
import {colors, font, layout, text} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';

export const ReceiveFunds = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const bankAccountStore = useStore('bankAccountStore');
  const haveBankAccount = bankAccountStore?.data?.size !== 0;

  const addBankAccount = useCallback(() => {
    setIsModalVisible(true);
  }, []);
  const closeModal = () => {
    setIsModalVisible(false);
  };
  const removeAccount = () => {
    console.log('remove');
  };

  const handleSubmit = async (): Promise<void> => {
    // onSubmit();
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      { !haveBankAccount ? (
        <View style={styles.containerWithBackground}>
          <Image
            style={styles.imageWithBackground}
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
      ) : (
        <View style={styles.containerWithoutBackground}>
          <Image
            style={styles.image}
            source={require('~/Assets/funds.png')}
          />
          <View style={styles.bankAccountData}>
            <View>
              <Text style={styles.accountDataLable}>ID Number</Text>
              <Text style={styles.accountDataLable}>Bank Name</Text>
              <Text style={styles.accountDataLable}>Branch</Text>
              <Text style={styles.accountDataLable}>Account</Text>
            </View>
            <View>
              <Text style={styles.accountDataText}>849384729</Text>
              <Text style={styles.accountDataText}>Raif Bank</Text>
              <Text style={styles.accountDataText}>875</Text>
              <Text style={styles.accountDataText}>18724394</Text>
            </View>
          </View>
          <Text style={styles.subTitle}>
            These details are needed in order to transfer funds to your account and vissible to you only.
          </Text>
        </View>
      )}

      <BottomSheetModal
        style={{borderRadius: 30}}
        isVisible={isModalVisible}
        onClose={closeModal}>
          <AddBankAccountForm
            onCancel={closeModal}
            onDelete={removeAccount}
            onSubmit={handleSubmit}
            isAddingNew={true}
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
  containerWithBackground: {
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
  containerWithoutBackground: {
    width: '100%',
    paddingBottom: 24,
    borderRadius: 14,
    alignItems: 'center',
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
  imageWithBackground: {
    height: 160,
    width: 160,
  },
  image: {
    height: 140,
    width: 140,
  },
  bankAccountData: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: colors.grey4,
    borderWidth: 1,
    borderRadius: 14,
    width: '100%',
    paddingTop: 36,
    paddingBottom: 27,
    marginTop: 24,
  },
  accountDataLable: {
    ...font.primary.bold,
    fontSize: 14,
    marginBottom: 9,
  },
  accountDataText: {
    ...font.primary.regular,
    fontSize: 14,
    marginBottom: 9,
    lineHeight: 18.5,
  },
});

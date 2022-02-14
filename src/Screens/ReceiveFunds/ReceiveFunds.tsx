import React, {useCallback, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {AddBankAccountForm} from '~/Components/Forms/AddBankAccountForm';
import BankAccountService from '~/Services/BankAccountService';
import {colors, font, layout, text} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/Util/Toast';
import {observer} from 'mobx-react-lite';

const ReceiveFunds = () => {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const bankAccountStore = useStore('bankAccountStore');
  const bankAccountData = bankAccountStore.bankAccountData;
  const socialId = bankAccountData?.socialId;
  const bankName = bankAccountData?.bankName;
  const branchNumber = bankAccountData?.branchNumber;
  const accountNumber = bankAccountData?.accountNumber;

  const addBankAccount = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const removeAccount = async () => {
    try {
      Toast.loading('Uploading...');
      await BankAccountService.deleteBankAccountDetails();
      Toast.hide();
      Toast.success('Done');
    } catch (err) {
      Toast.error('Something went wrong');
    }
  };

  const handleSubmit = async (): Promise<void> => {
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
              <Text style={styles.accountDataText}>{socialId}</Text>
              <Text style={styles.accountDataText}>{bankName}</Text>
              <Text style={styles.accountDataText}>{branchNumber}</Text>
              <Text style={styles.accountDataText}>{accountNumber}</Text>
            </View>
          </View>
          <Text style={styles.subTitle}>
            These details are needed in order to transfer funds to your account and vissible to you only.
          </Text>

        </View>
      )}
      { haveBankAccount && (
        <TouchableOpacity
          style={[styles.removeButton, {marginBottom: insets.bottom + 24}]}
          onPress={removeAccount}>
          <Text style={styles.removeButtonText}>Remove Account</Text>
        </TouchableOpacity>
      )}

      <BottomSheetModal
        style={{borderRadius: 30}}
        isVisible={isModalVisible}
        onClose={closeModal}>
          <AddBankAccountForm
            onDelete={removeAccount}
            onSubmit={handleSubmit}
            isAddingNew={!haveBankAccount}
          />
      </BottomSheetModal>
    </View>
  );
};

export default observer(ReceiveFunds);

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
  removeButton: {
    position: 'absolute',
    bottom: 0,
    height: 48,
    justifyContent: 'center',
    borderRadius: 32,
    borderColor: colors.grey4,
    borderWidth: 1,
    width: '100%',
    alignSelf: 'center',
  },
  removeButtonText: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.mainBlue,
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
